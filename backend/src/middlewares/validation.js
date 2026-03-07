const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Registration validation rules
const validateRegistration = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').trim().notEmpty().withMessage('First name required'),
  body('lastName').trim().notEmpty().withMessage('Last name required'),
  body('deviceId').notEmpty().withMessage('Device ID required'),
  handleValidationErrors,
];

// Login validation rules
const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  body('deviceId').notEmpty().withMessage('Device ID required'),
  handleValidationErrors,
];

// Fee transaction validation rules
const validateFeeTransaction = [
  body('studentId').isUUID().withMessage('Valid student ID required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description').optional().trim(),
  handleValidationErrors,
];

// Refund request validation rules
const validateRefundRequest = [
  body('studentId').isUUID().withMessage('Valid student ID required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('reason').trim().notEmpty().withMessage('Reason required'),
  handleValidationErrors,
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateFeeTransaction,
  validateRefundRequest,
};
