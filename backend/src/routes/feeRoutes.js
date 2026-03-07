const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { validateFeeTransaction, validateRefundRequest } = require('../middlewares/validation');
const { authenticate, authorize } = require('../middlewares/auth');

// All routes require authentication and PARENT role
router.use(authenticate);
router.use(authorize('PARENT'));

// Fee operations
router.post('/deposit', validateFeeTransaction, feeController.deposit);
router.post('/refund', validateRefundRequest, feeController.requestRefund);

// Get fee information
router.get('/balance/:studentId', feeController.getBalance);
router.get('/transactions/:studentId', feeController.getTransactions);
router.get('/refunds/:studentId', feeController.getRefunds);

module.exports = router;
