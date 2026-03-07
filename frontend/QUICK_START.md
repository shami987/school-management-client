# Quick Start Guide

## 🚀 Start the Application

### Step 1: Start Backend (Terminal 1)
```bash
cd ../backend
npm run dev
```
Wait for: "Client backend server running on port 3001"

### Step 2: Start Frontend (Terminal 2)
```bash
npm start
```
Browser opens automatically at http://localhost:3000

## 🧪 Test the Application

### Option 1: Use Test Account
1. Click "Login"
2. Email: `parent@test.com`
3. Password: `Parent@123`
4. Click "Login"

### Option 2: Register New Account
1. Click "Register"
2. Fill in your details
3. Click "Register"
4. **Important**: Ask admin to verify your device
5. Then login

## 📱 Features to Test

### Dashboard
- View all your children
- Click on a student card

### Student Details
- **Overview Tab**: See basic info
- **Fees Tab**: 
  - Click "Deposit" to add money
  - Click "Request Refund" to request money back
  - View transaction history
- **Grades Tab**: See academic performance
- **Attendance Tab**: Check attendance records
- **Timetable Tab**: View class schedule

## ⚠️ Common Issues

### "Network Error"
- Make sure backend is running on port 3001
- Check .env file has correct API URL

### "Device not verified"
- Admin needs to verify your device first
- Use test account (already verified)

### Port 3000 already in use
```bash
# Kill the process or use different port
set PORT=3001 && npm start
```

## ✅ Ready to Commit

Once everything works:
```bash
git add .
git commit -m "feat: complete client frontend with authentication, dashboard, and fee management"
```

## 🎯 What You Built

- ✅ Registration page
- ✅ Login page
- ✅ Dashboard with student list
- ✅ Student detail page with 5 tabs
- ✅ Fee deposit functionality
- ✅ Refund request functionality
- ✅ Transaction history
- ✅ Grades display
- ✅ Attendance records
- ✅ Class timetable
- ✅ Responsive design
- ✅ Protected routes

## 📚 Documentation

- `README.md` - Full documentation
- `BUILD_SUMMARY.md` - What was built
- `COMMIT_GUIDE.md` - How to commit
- `QUICK_START.md` - This file

Enjoy! 🎉
