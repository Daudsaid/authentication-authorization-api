import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken,
  generateVerificationToken,
  generatePasswordResetToken
} from '../utils/tokens';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService';
import { User, RegisterRequest, LoginRequest } from '../types';

// Register
export const register = async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await pool.query<User>(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userExists.rows.length > 0) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = generateVerificationToken();

    // Insert user
    const newUser = await pool.query<User>(
      `INSERT INTO users (username, email, password, verification_token) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, role, is_verified, created_at`,
      [username, email, hashedPassword, verificationToken]
    );

    // Send verification email (don't await - send in background)
    sendVerificationEmail(email, verificationToken).catch(err => 
      console.error('Email send failed:', err)
    );

    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account.',
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Verify Email
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      res.status(400).json({ error: 'Verification token required' });
      return;
    }

    const user = await pool.query<User>(
      'SELECT * FROM users WHERE verification_token = $1',
      [token]
    );

    if (user.rows.length === 0) {
      res.status(400).json({ error: 'Invalid verification token' });
      return;
    }

    // Mark user as verified
    await pool.query(
      'UPDATE users SET is_verified = true, verification_token = NULL WHERE id = $1',
      [user.rows[0].id]
    );

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login
export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await pool.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const userData = user.rows[0];

    // Check if email is verified
    if (!userData.is_verified) {
      res.status(403).json({ error: 'Please verify your email first' });
      return;
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, userData.password);

    if (!validPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate tokens
    const payload = {
      id: userData.id,
      username: userData.username,
      role: userData.role
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token in database (delete old ones first to avoid duplicates)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await pool.query(
      'DELETE FROM refresh_tokens WHERE token = $1',
      [refreshToken]
    );
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userData.id, refreshToken, expiresAt]
    );

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Refresh Token
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token required' });
      return;
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if token exists in database
    const tokenRecord = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    );

    if (tokenRecord.rows.length === 0) {
      res.status(403).json({ error: 'Invalid or expired refresh token' });
      return;
    }

    // Generate new access token
    const payload = { 
      id: decoded.id, 
      username: decoded.username, 
      role: decoded.role 
    };
    
    const newAccessToken = generateAccessToken(payload);

    res.json({
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

// Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Delete refresh token from database
      await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Request Password Reset
export const requestPasswordReset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await pool.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      // Don't reveal if user exists
      res.json({ message: 'If the email exists, a reset link has been sent' });
      return;
    }

    const userData = user.rows[0];
    const resetToken = generatePasswordResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userData.id, resetToken, expiresAt]
    );

    // Send reset email
    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ error: 'Token and new password required' });
      return;
    }

    // Find valid token
    const tokenRecord = await pool.query(
      `SELECT * FROM password_reset_tokens 
       WHERE token = $1 AND expires_at > NOW() AND used = false`,
      [token]
    );

    if (tokenRecord.rows.length === 0) {
      res.status(400).json({ error: 'Invalid or expired reset token' });
      return;
    }

    const resetData = tokenRecord.rows[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, resetData.user_id]
    );

    // Mark token as used
    await pool.query(
      'UPDATE password_reset_tokens SET used = true WHERE id = $1',
      [resetData.id]
    );

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Profile (Protected)
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await pool.query<User>(
      'SELECT id, username, email, role, is_verified, created_at FROM users WHERE id = $1',
      [req.user!.id]
    );

    if (user.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user: user.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
