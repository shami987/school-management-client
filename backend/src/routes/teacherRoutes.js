const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { authenticate, authorize } = require('../middlewares/auth');

// All routes require authentication and TEACHER role
router.use(authenticate);
router.use(authorize('TEACHER'));

// Class management
router.get('/classes', teacherController.getMyClasses);
router.get('/classes/:classId/students', teacherController.getClassStudents);

// Grade management
router.post('/grades', teacherController.addGrade);

// Attendance management
router.post('/attendance', teacherController.markAttendance);

module.exports = router;