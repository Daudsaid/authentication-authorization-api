import { Router } from 'express';
import {
  register,
  verifyEmail,
  login,
  refresh,
  logout,
  requestPasswordReset,
  resetPassword,
  getProfile
} from '../controllers/authController';
import { authenticateToken, requireRole } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

// Admin only route (example)
router.get('/admin', authenticateToken, requireRole(['admin']), (req, res) => {
  res.json({ message: 'Welcome admin!' });
});

export default router;
