const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate, authorize } = require('../middlewares/auth');

// All routes require authentication and STUDENT role
router.use(authenticate);
router.use(authorize('STUDENT'));

// Student profile and academic data
router.get('/profile', studentController.getMyProfile);
router.get('/grades', studentController.getMyGrades);
router.get('/attendance', studentController.getMyAttendance);
router.get('/timetable', studentController.getMyTimetable);

module.exports = router;