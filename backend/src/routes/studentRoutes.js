const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate, authorize } = require('../middlewares/auth');

// All routes require authentication and PARENT role
router.use(authenticate);
router.use(authorize('PARENT'));

// Student operations
router.get('/', studentController.getMyStudents);
router.get('/:studentId', studentController.getStudent);
router.get('/:studentId/grades', studentController.getGrades);
router.get('/:studentId/attendance', studentController.getAttendance);
router.get('/:studentId/timetable', studentController.getTimetable);

module.exports = router;
