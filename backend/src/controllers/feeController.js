const feeService = require('../services/feeService');
const { feeBalanceDTO, transactionDTO, refundRequestDTO } = require('../dtos');
const { getParentProfileId } = require('../utils/helpers');

// Deposit fee
const deposit = async (req, res, next) => {
  try {
    const { studentId, amount, description } = req.body;
    const parentId = await getParentProfileId(req.user.userId);

    const result = await feeService.depositFee(
      studentId,
      parseFloat(amount),
      description,
      parentId
    );

    res.status(201).json({
      message: 'Payment successful',
      transaction: transactionDTO(result.transaction),
      balance: feeBalanceDTO(result.feeBalance),
    });
  } catch (error) {
    next(error);
  }
};

// Request refund
const requestRefund = async (req, res, next) => {
  try {
    const { studentId, amount, reason } = req.body;
    const parentId = await getParentProfileId(req.user.userId);

    const refund = await feeService.requestRefund(
      studentId,
      parseFloat(amount),
      reason,
      parentId
    );

    res.status(201).json({
      message: 'Refund request submitted successfully',
      refund: refundRequestDTO(refund),
    });
  } catch (error) {
    next(error);
  }
};

// Get fee balance
const getBalance = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const parentId = await getParentProfileId(req.user.userId);

    const balance = await feeService.getFeeBalance(studentId, parentId);

    res.json({
      balance: feeBalanceDTO(balance),
    });
  } catch (error) {
    next(error);
  }
};

// Get transaction history
const getTransactions = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const parentId = await getParentProfileId(req.user.userId);

    const transactions = await feeService.getTransactionHistory(studentId, parentId);

    res.json({
      transactions: transactions.map(transactionDTO),
    });
  } catch (error) {
    next(error);
  }
};

// Get refund requests
const getRefunds = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const parentId = await getParentProfileId(req.user.userId);

    const refunds = await feeService.getRefundRequests(studentId, parentId);

    res.json({
      refunds: refunds.map(refundRequestDTO),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  deposit,
  requestRefund,
  getBalance,
  getTransactions,
  getRefunds,
};
