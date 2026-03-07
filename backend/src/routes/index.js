const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const studentRoutes = require('./studentRoutes');
const feeRoutes = require('./feeRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/fees', feeRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Client backend is running' });
});

module.exports = router;
