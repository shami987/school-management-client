import api from './api';

export const deposit = async (studentId, amount, description) => {
  const response = await api.post('/fees/deposit', {
    studentId,
    amount: parseFloat(amount),
    description,
  });
  return response.data;
};

export const requestRefund = async (studentId, amount, reason) => {
  const response = await api.post('/fees/refund', {
    studentId,
    amount: parseFloat(amount),
    reason,
  });
  return response.data;
};

export const getBalance = async (studentId) => {
  const response = await api.get(`/fees/balance/${studentId}`);
  return response.data;
};

export const getTransactions = async (studentId) => {
  const response = await api.get(`/fees/transactions/${studentId}`);
  return response.data;
};

export const getRefunds = async (studentId) => {
  const response = await api.get(`/fees/refunds/${studentId}`);
  return response.data;
};
