# Advanced Authentication & Authorization API

A production-ready authentication API built with Node.js, TypeScript, Express, and PostgreSQL featuring JWT tokens, refresh tokens, RBAC, email verification, and password reset functionality.

## Features

- 🔐 **JWT Authentication** - Access tokens (15min) & refresh tokens (7 days)
- 👤 **User Management** - Registration, login, profile
- ✉️ **Email Verification** - Token-based email verification system
- 🔄 **Password Reset** - Secure password reset with expiring tokens
- 🛡️ **Role-Based Access Control (RBAC)** - User and admin roles
- 🔒 **Secure Password Hashing** - bcrypt with salt rounds
- ✅ **Comprehensive Testing** - Jest & Supertest with 8 test cases
- 📝 **TypeScript** - Full type safety

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Testing:** Jest, Supertest
- **Email:** Nodemailer

## API Endpoints

### Public Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email?token=TOKEN` - Verify email
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout (invalidate refresh token)

### Protected Routes
- `GET /api/auth/profile` - Get user profile (requires authentication)
- `GET /api/auth/admin` - Admin only route (requires admin role)

## Installation

1. Clone the repository
```bash
git clone https://github.com/Daudsaid/authentication-authorization-api.git
cd authentication-authorization-api
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Create PostgreSQL databases
```bash
psql -U your_user -d postgres -c "CREATE DATABASE authentication_authorization_api;"
psql -U your_user -d postgres -c "CREATE DATABASE authentication_authorization_api_test;"
```

5. Run database migrations
```bash
psql -U your_user -d authentication_authorization_api -f database/schema.sql
```

## Environment Variables
```env
PORT=4000
DATABASE_URL=postgresql://user@localhost:5432/authentication_authorization_api
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
CLIENT_URL=http://localhost:3000
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Testing
```bash
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## Example Requests

### Register
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:4000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Database Schema

### Users Table
- `id` - Serial primary key
- `username` - Unique username
- `email` - Unique email
- `password` - Hashed password
- `role` - User role (user/admin)
- `is_verified` - Email verification status
- `verification_token` - Email verification token
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Refresh Tokens Table
- `id` - Serial primary key
- `user_id` - Foreign key to users
- `token` - Refresh token
- `expires_at` - Token expiration
- `created_at` - Timestamp

### Password Reset Tokens Table
- `id` - Serial primary key
- `user_id` - Foreign key to users
- `token` - Reset token
- `expires_at` - Token expiration
- `used` - Token usage status
- `created_at` - Timestamp

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Refresh token rotation
- ✅ Token expiration
- ✅ Email verification
- ✅ Password reset with expiring tokens
- ✅ Role-based access control
- ✅ SQL injection prevention (parameterized queries)

## Testing

The API includes comprehensive test coverage:

- User registration tests
- Login authentication tests
- Token validation tests
- Protected route access tests
- Error handling tests

Run tests with:
```bash
npm test
```

## Author

**Daud Abdi**
- GitHub: [@Daudsaid](https://github.com/Daudsaid)
- LinkedIn: [daudabdi0506](https://linkedin.com/in/daudabdi0506)
- Email: daudsaidabdi@gmail.com
- Portfolio: https://daud-abdi-portfolio-site.vercel.app/

## License

MIT
