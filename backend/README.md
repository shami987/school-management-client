# School Management System - Client Backend

Backend API for parents/students to manage fee payments, view academic records, and access school information.

## Features

- **Authentication & Security**
  - SHA-512 + bcrypt password hashing
  - JWT-based authentication
  - Device verification system (admin approval required)
  - Multiple device support per user
  - Rate limiting and security headers (Helmet)
  - Input validation and sanitization

- **Fee Management**
  - Deposit fees (simulated payment)
  - Request refunds (requires admin approval)
  - View fee balance per student
  - Transaction history

- **Academic Records**
  - View student grades
  - View attendance records
  - View class timetable

## Tech Stack

- Node.js + Express.js
- PostgreSQL + Prisma ORM
- JWT for authentication
- Helmet for security headers
- Express Rate Limit
- Express Validator

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
```bash
cd client-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/school_management?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

4. **Setup database**
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

5. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:3001`

## API Endpoints

### Authentication

#### Register Parent
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "parent@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "deviceId": "uuid-generated-on-client",
  "deviceName": "Chrome on Windows"
}
```

**Response:**
```json
{
  "message": "Registration successful. Please wait for device verification",
  "user": {
    "id": "uuid",
    "email": "parent@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "PARENT"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "parent@example.com",
  "password": "SecurePass123",
  "deviceId": "uuid-generated-on-client"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "parent@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "PARENT"
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Students

#### Get My Students
```http
GET /api/students
Authorization: Bearer <token>
```

#### Get Student Details
```http
GET /api/students/:studentId
Authorization: Bearer <token>
```

#### Get Student Grades
```http
GET /api/students/:studentId/grades
Authorization: Bearer <token>
```

#### Get Student Attendance
```http
GET /api/students/:studentId/attendance
Authorization: Bearer <token>
```

#### Get Student Timetable
```http
GET /api/students/:studentId/timetable
Authorization: Bearer <token>
```

### Fees

#### Deposit Fee
```http
POST /api/fees/deposit
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "uuid",
  "amount": 50000,
  "description": "Term 1 fees"
}
```

#### Request Refund
```http
POST /api/fees/refund
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "uuid",
  "amount": 10000,
  "reason": "Overpayment"
}
```

#### Get Fee Balance
```http
GET /api/fees/balance/:studentId
Authorization: Bearer <token>
```

#### Get Transaction History
```http
GET /api/fees/transactions/:studentId
Authorization: Bearer <token>
```

#### Get Refund Requests
```http
GET /api/fees/refunds/:studentId
Authorization: Bearer <token>
```

### Health Check
```http
GET /api/health
```

## Project Structure

```
client-backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js            # Database seeding script
├── src/
│   ├── config/
│   │   ├── database.js    # Prisma client
│   │   └── jwt.js         # JWT utilities
│   ├── controllers/       # Request handlers
│   │   ├── authController.js
│   │   ├── feeController.js
│   │   └── studentController.js
│   ├── dtos/              # Data transfer objects
│   │   └── index.js
│   ├── middlewares/       # Express middlewares
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validation.js
│   ├── routes/            # API routes
│   │   ├── authRoutes.js
│   │   ├── feeRoutes.js
│   │   ├── studentRoutes.js
│   │   └── index.js
│   ├── services/          # Business logic
│   │   ├── authService.js
│   │   ├── feeService.js
│   │   └── studentService.js
│   ├── utils/             # Utility functions
│   │   └── password.js
│   └── server.js          # Express app entry point
├── .env.example           # Environment variables template
├── package.json
└── README.md
```

## Security Features

- **Password Hashing**: SHA-512 + bcrypt
- **JWT Authentication**: 24-hour token expiration
- **Device Verification**: Admin must verify each device before access
- **Rate Limiting**: 
  - Auth endpoints: 5 requests per 15 minutes
  - API endpoints: 100 requests per 15 minutes
- **Helmet**: Security headers
- **Input Validation**: Express-validator
- **CORS**: Configurable origin
- **Role-based Access Control**: Parent role required for protected routes

## Test Credentials

After running the seed script:

**Admin Account:**
- Email: `admin@school.com`
- Password: `Admin@123`
- Device ID: `admin-test-device`
- Status: ✅ Pre-verified for testing

**Parent Account:**
- Email: `parent@test.com`
- Password: `Parent@123`
- Device ID: `parent-test-device`
- Status: ✅ Pre-verified for testing

## Device Verification Flow

1. Parent registers with email, password, and deviceId (UUID from client)
2. Device status is set to `PENDING`
3. Admin verifies the device (via Admin backend)
4. Device status changes to `VERIFIED`
5. Parent can now login with that device

## Testing with Postman

### Login Admin
```json
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "Admin@123",
  "deviceId": "admin-test-device"
}
```

### Login Parent
```json
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "parent@test.com",
  "password": "Parent@123",
  "deviceId": "parent-test-device"
}
```

### Get Students (use parent token)
```json
GET http://localhost:3001/api/students
Authorization: Bearer <parent-jwt-token>
```

### Deposit Fee (use parent token)
```json
POST http://localhost:3001/api/fees/deposit
Authorization: Bearer <parent-jwt-token>
Content-Type: application/json

{
  "studentId": "<student-uuid-from-get-students>",
  "amount": 10000,
  "description": "Term fees"
}
```

## Error Handling

All errors return JSON format:
```json
{
  "error": "Error message"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad request (validation error)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (device not verified or insufficient permissions)
- `404`: Not found
- `409`: Conflict (duplicate resource)
- `429`: Too many requests (rate limit)
- `500`: Internal server error

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Generate Prisma client after schema changes
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Reset database and reseed
npm run prisma:migrate reset
```

## Troubleshooting

### Port Already in Use
If you get `EADDRINUSE` error:
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in .env
PORT=3002
```

### Device Not Registered Error
Make sure you're using the correct deviceId:
- Admin: `admin-test-device`
- Parent: `parent-test-device`

## Notes

- Parent accounts can have multiple students (children)
- Fee balance is tracked per student
- Refund requests require admin approval
- One user can have multiple verified devices
- JWT tokens expire after 24 hours
- Sessions should be cleared on browser close (client-side implementation)
- Device IDs are generated on the frontend and stored in localStorage

## License

MIT
