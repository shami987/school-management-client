const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const studentRoutes = require('./studentRoutes');
const feeRoutes = require('./feeRoutes');
const teacherRoutes = require('./teacherRoutes');
const studentUserRoutes = require('./studentUserRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/students', studentRoutes); // Parent access to students
router.use('/fees', feeRoutes);
router.use('/teacher', teacherRoutes); // Teacher functionality
router.use('/student', studentUserRoutes); // Student user functionality

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Client backend is running' });
});

module.exports = router;
