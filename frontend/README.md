# School Management System - Client Frontend

React.js web application for parents/students to manage school activities, view academic records, and handle fee payments.

## Features

- **Authentication**
  - Parent registration with automatic device ID generation
  - Secure login with device verification
  - Session management with JWT tokens

- **Dashboard**
  - View all children/students
  - Quick access to student details
  - Clean and intuitive interface

- **Student Management**
  - View student information
  - Access grades and academic performance
  - Check attendance records
  - View class timetable

- **Fee Management**
  - View current fee balance
  - Make fee deposits (payments)
  - Request refunds
  - View transaction history
  - Low balance warnings

## Tech Stack

- React.js 18
- React Router DOM (routing)
- Axios (API calls)
- Tailwind CSS (styling)
- Context API (state management)
- UUID (device ID generation)

## Prerequisites

- Node.js (v16 or higher)
- Backend server running on http://localhost:3001

## Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
The `.env` file is already configured:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

3. **Start development server**
```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   └── PrivateRoute.js      # Protected route wrapper
│   ├── context/
│   │   └── AuthContext.js       # Authentication state
│   ├── pages/
│   │   ├── Register.js          # Registration page
│   │   ├── Login.js             # Login page
│   │   ├── Dashboard.js         # Main dashboard
│   │   └── StudentDetail.js     # Student details with tabs
│   ├── services/
│   │   ├── api.js               # Axios configuration
│   │   ├── authService.js       # Auth API calls
│   │   ├── studentService.js    # Student API calls
│   │   └── feeService.js        # Fee API calls
│   ├── App.js                   # Main app with routing
│   ├── index.js                 # Entry point
│   └── index.css                # Tailwind CSS
├── .env                         # Environment variables
├── package.json
└── README.md
```

## Usage Flow

### 1. Registration
- Navigate to `/register`
- Fill in parent details (first name, last name, email, password)
- Device ID is automatically generated and stored
- Wait for admin to verify your device

### 2. Login
- Navigate to `/login`
- Enter email and password
- Device ID is automatically included
- Redirects to dashboard on success

### 3. Dashboard
- View all your children
- Click on a student card to view details

### 4. Student Details
- **Overview Tab**: Basic student information and fee balance
- **Fees Tab**: 
  - View current balance
  - Make deposits (payments)
  - Request refunds
  - View transaction history
- **Grades Tab**: View academic performance by subject
- **Attendance Tab**: Check attendance records
- **Timetable Tab**: View class schedule

## API Integration

All API calls are handled through service files:

- `authService.js` - Registration, login, logout
- `studentService.js` - Student data, grades, attendance, timetable
- `feeService.js` - Balance, transactions, deposits, refunds

## Device Management

- Device ID is automatically generated on first visit
- Stored in localStorage
- Sent with registration and login requests
- Admin must verify device before full access

## Test Credentials

After backend seeding:

```
Email: parent@test.com
Password: Parent@123
```

Note: Device must be verified by admin first.

## Building for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

## Features Implemented

✅ Parent registration with device tracking
✅ Secure login with JWT
✅ Dashboard with student list
✅ Student detail view with tabs
✅ Fee deposit functionality
✅ Refund request functionality
✅ Transaction history
✅ Grades display
✅ Attendance records
✅ Class timetable
✅ Low balance warnings
✅ Responsive design
✅ Protected routes
✅ Session management
✅ Error handling

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Notes

- Device ID is stored in localStorage
- JWT token expires after 24 hours
- Session clears on logout
- All routes except login/register are protected
- Responsive design works on mobile, tablet, and desktop

## Troubleshooting

### Backend Connection Error
Make sure backend is running on port 3001:
```bash
cd ../backend
npm run dev
```

### Device Not Verified
Contact admin to verify your device after registration.

### Token Expired
Simply login again to get a new token.

## License

MIT
