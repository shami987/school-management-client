import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudent, getGrades, getAttendance, getTimetable } from '../services/studentService';
import { getBalance, getTransactions, deposit, requestRefund } from '../services/feeService';

const StudentDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [student, setStudent] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDesc, setDepositDesc] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [studentData, balanceData, transData, gradesData, attData, timeData] = await Promise.all([
        getStudent(studentId),
        getBalance(studentId),
        getTransactions(studentId),
        getGrades(studentId),
        getAttendance(studentId),
        getTimetable(studentId),
      ]);
      setStudent(studentData.student);
      setBalance(balanceData.balance);
      setTransactions(transData.transactions || []);
      setGrades(gradesData.grades || []);
      setAttendance(attData.attendance || []);
      setTimetable(timeData.timetable || []);
    } catch (err) {
      alert('Failed to load student data');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      await deposit(studentId, depositAmount, depositDesc);
      alert('Payment successful!');
      setShowDepositModal(false);
      setDepositAmount('');
      setDepositDesc('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Payment failed');
    }
  };

  const handleRefund = async (e) => {
    e.preventDefault();
    try {
      await requestRefund(studentId, refundAmount, refundReason);
      alert('Refund request submitted!');
      setShowRefundModal(false);
      setRefundAmount('');
      setRefundReason('');
    } catch (err) {
      alert(err.response?.data?.error || 'Refund request failed');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {student?.firstName} {student?.lastName}
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            {['overview', 'fees', 'grades', 'attendance', 'timetable'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Class</p>
                    <p className="font-semibold">{student?.class?.name || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Grade</p>
                    <p className="font-semibold">{student?.class?.grade || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Fee Balance</p>
                    <p className="font-semibold text-green-600">{balance?.balance || 0} RWF</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Enrollment Date</p>
                    <p className="font-semibold">
                      {new Date(student?.enrollmentDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fees' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold">Balance: {balance?.balance || 0} RWF</h3>
                    {balance?.balance < 10000 && (
                      <p className="text-red-600 text-sm">⚠️ Low balance warning</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDepositModal(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Deposit
                    </button>
                    <button
                      onClick={() => setShowRefundModal(true)}
                      className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                    >
                      Request Refund
                    </button>
                  </div>
                </div>

                <h4 className="font-semibold mb-4">Transaction History</h4>
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-semibold">{tx.type}</p>
                        <p className="text-sm text-gray-600">{tx.description}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.amount} RWF
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'grades' && (
              <div className="space-y-4">
                {grades.length === 0 ? (
                  <p className="text-gray-600">No grades available</p>
                ) : (
                  grades.map((grade) => (
                    <div key={grade.id} className="p-4 bg-gray-50 rounded">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-semibold">{grade.subject}</h4>
                          <p className="text-sm text-gray-600">{grade.term} - {grade.academicYear}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{grade.percentage}%</p>
                          <p className="text-sm text-gray-600">{grade.score}/{grade.maxScore}</p>
                        </div>
                      </div>
                      {grade.remarks && <p className="text-sm text-gray-600 mt-2">{grade.remarks}</p>}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-2">
                {attendance.length === 0 ? (
                  <p className="text-gray-600">No attendance records</p>
                ) : (
                  attendance.map((att) => (
                    <div key={att.id} className="flex justify-between p-3 bg-gray-50 rounded">
                      <p>{new Date(att.date).toLocaleDateString()}</p>
                      <span className={`px-3 py-1 rounded ${
                        att.status === 'PRESENT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {att.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'timetable' && (
              <div className="space-y-2">
                {timetable.length === 0 ? (
                  <p className="text-gray-600">No timetable available</p>
                ) : (
                  timetable.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 rounded">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-semibold">{item.subject}</h4>
                          <p className="text-sm text-gray-600">{item.dayOfWeek}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{item.startTime} - {item.endTime}</p>
                          <p className="text-sm text-gray-600">Room: {item.room || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Deposit Fee</h3>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Amount (RWF)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  required
                  min="1"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={depositDesc}
                  onChange={(e) => setDepositDesc(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">
                  Deposit
                </button>
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Request Refund</h3>
            <form onSubmit={handleRefund} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Amount (RWF)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  required
                  min="1"
                  max={balance?.balance || 0}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Reason</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowRefundModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetail;
