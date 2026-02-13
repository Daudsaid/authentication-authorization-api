# 🔐 Authentication & Authorization API

**Built by [Daud Abdi](https://linkedin.com/in/daudabdi0506)**

🌐 **Live Demo:** http://3.10.174.145:4000  
💻 **GitHub:** [View Source](https://github.com/Daudsaid/authentication-authorization-api)  
📧 **Contact:** daudsaidabdi@gmail.com  
📱 **Portfolio:** [daud-abdi-portfolio-site.vercel.app](https://daud-abdi-portfolio-site.vercel.app)

---

A production-ready authentication and authorization API built with Node.js, Express, TypeScript, and PostgreSQL. Deployed on AWS infrastructure with JWT-based authentication, email verification, and role-based access control.

## ✨ Features

- 🔐 User registration with email verification
- 🎫 JWT-based authentication (access + refresh tokens)
- 🔄 Automatic token refresh mechanism
- 🔑 Secure password reset flow
- 👥 Role-based access control (user/admin)
- 📧 Email notifications (verification, password reset)
- 🛡️ bcrypt password hashing
- ✅ Input validation and error handling
- 🧪 Comprehensive test coverage with Jest

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt

**Deployment:**
- AWS EC2 (Ubuntu 24.04)
- AWS RDS (PostgreSQL)
- PM2 Process Manager
- SSL/TLS Database Connection

**Testing:**
- Jest
- Supertest

## 📡 API Endpoints

### Public Endpoints

#### Register User
```bash
POST http://3.10.174.145:4000/api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```bash
POST http://3.10.174.145:4000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Refresh Token
```bash
POST http://3.10.174.145:4000/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token_here"
}
```

#### Forgot Password
```bash
POST http://3.10.174.145:4000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Protected Endpoints

#### Get User Profile
```bash
GET http://3.10.174.145:4000/api/auth/profile
Authorization: Bearer your_access_token_here
```

### Utility Endpoints

#### Health Check
```bash
GET http://3.10.174.145:4000/health
```

#### API Info
```bash
GET http://3.10.174.145:4000/
```

## 🚀 Deployment Architecture
```
┌─────────────────────────────────┐
│     AWS EC2 (Ubuntu 24.04)      │
│   Node.js + Express + PM2       │
│   Port: 4000                    │
└─────────────┬───────────────────┘
              │
              │ SSL Connection
              ▼
┌─────────────────────────────────┐
│   AWS RDS PostgreSQL 17.6       │
│   - users table                 │
│   - refresh_tokens table        │
│   - password_reset_tokens       │
└─────────────────────────────────┘
```

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Daudsaid/authentication-authorization-api.git
cd authentication-authorization-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file:
```env
PORT=4000
DATABASE_URL=postgresql://username:password@localhost:5432/auth_db
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

4. **Set up database**
```bash
# Create database
createdb auth_db

# Run schema (see src/__tests__/setup/testDb.helper.ts for table definitions)
```

5. **Run development server**
```bash
npm run dev
```

The API will be available at `http://localhost:4000`

## 🧪 Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📦 Production Build
```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT tokens with expiration
- ✅ Refresh token rotation
- ✅ HTTPS/SSL database connections
- ✅ Environment variable management
- ✅ Input validation and sanitization
- ✅ SQL injection protection (parameterized queries)
- ✅ CORS configuration

## 📊 Database Schema
```sql
users
├── id (SERIAL PRIMARY KEY)
├── username (VARCHAR UNIQUE)
├── email (VARCHAR UNIQUE)
├── password (VARCHAR - hashed)
├── role (VARCHAR - 'user'/'admin')
├── is_verified (BOOLEAN)
├── verification_token (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

refresh_tokens
├── id (SERIAL PRIMARY KEY)
├── user_id (INTEGER FK → users.id)
├── token (VARCHAR UNIQUE)
├── expires_at (TIMESTAMP)
└── created_at (TIMESTAMP)

password_reset_tokens
├── id (SERIAL PRIMARY KEY)
├── user_id (INTEGER FK → users.id)
├── token (VARCHAR UNIQUE)
├── expires_at (TIMESTAMP)
├── used (BOOLEAN)
└── created_at (TIMESTAMP)
```

## 🎯 Future Enhancements

- [ ] OAuth 2.0 integration (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] Rate limiting middleware
- [ ] API documentation with Swagger/OpenAPI
- [ ] Docker containerization
- [ ] CI/CD pipeline with GitHub Actions

## 📄 License

MIT License

## 👤 Author

**Daud Abdi**

- Portfolio: [daud-abdi-portfolio-site.vercel.app](https://daud-abdi-portfolio-site.vercel.app)
- LinkedIn: [linkedin.com/in/daudabdi0506](https://linkedin.com/in/daudabdi0506)
- GitHub: [@Daudsaid](https://github.com/Daudsaid)
- Email: daudsaidabdi@gmail.com

## 🙏 Acknowledgments

- Built as part of my full-stack development portfolio
- Deployed on AWS to demonstrate cloud infrastructure skills
- Following industry best practices for authentication systems

---

⭐ **If you found this project helpful, please consider giving it a star!**

Made with ❤️ by Daud Abdi