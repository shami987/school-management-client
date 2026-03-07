const prisma = require('../config/database');

// Deposit fee (simulated payment)
const depositFee = async (studentId, amount, description, parentId) => {
  // Verify student belongs to parent
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student || student.parentId !== parentId) {
    throw new Error('Student not found or access denied');
  }

  // Create transaction and update balance
  const result = await prisma.$transaction(async (tx) => {
    // Create transaction record
    const transaction = await tx.feeTransaction.create({
      data: {
        studentId,
        type: 'DEPOSIT',
        amount,
        description: description || 'Fee payment',
      },
    });

    // Update or create fee balance
    const feeBalance = await tx.feeBalance.upsert({
      where: { studentId },
      update: {
        balance: {
          increment: amount,
        },
      },
      create: {
        studentId,
        balance: amount,
      },
    });

    return { transaction, feeBalance };
  });

  return result;
};

// Request refund (withdraw)
const requestRefund = async (studentId, amount, reason, parentId) => {
  // Verify student belongs to parent
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { feeBalance: true },
  });

  if (!student || student.parentId !== parentId) {
    throw new Error('Student not found or access denied');
  }

  // Check if sufficient balance
  if (!student.feeBalance || parseFloat(student.feeBalance.balance) < parseFloat(amount)) {
    throw new Error('Insufficient balance');
  }

  // Create refund request
  const refundRequest = await prisma.refundRequest.create({
    data: {
      studentId,
      amount,
      reason,
      status: 'PENDING',
    },
  });

  return refundRequest;
};

// Get fee balance for student
const getFeeBalance = async (studentId, parentId) => {
  // Verify student belongs to parent
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { feeBalance: true },
  });

  if (!student || student.parentId !== parentId) {
    throw new Error('Student not found or access denied');
  }

  return student.feeBalance || { studentId, balance: 0 };
};

// Get transaction history
const getTransactionHistory = async (studentId, parentId) => {
  // Verify student belongs to parent
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student || student.parentId !== parentId) {
    throw new Error('Student not found or access denied');
  }

  const transactions = await prisma.feeTransaction.findMany({
    where: { studentId },
    orderBy: { createdAt: 'desc' },
  });

  return transactions;
};

// Get refund requests
const getRefundRequests = async (studentId, parentId) => {
  // Verify student belongs to parent
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student || student.parentId !== parentId) {
    throw new Error('Student not found or access denied');
  }

  const refunds = await prisma.refundRequest.findMany({
    where: { studentId },
    orderBy: { requestedAt: 'desc' },
  });

  return refunds;
};

module.exports = {
  depositFee,
  requestRefund,
  getFeeBalance,
  getTransactionHistory,
  getRefundRequests,
};
