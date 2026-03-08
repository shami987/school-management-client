import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, BookOpen, Calendar } from 'lucide-react';
import { getClassStudents, addGrade, markAttendance } from '../services/teacherService';

const ClassManagement = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');
  const [gradeForm, setGradeForm] = useState({
    studentId: '',
    subject: '',
    score: '',
    maxScore: '100',
    term: 'Term 1',
    academicYear: '2024',
    remarks: ''
  });
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});

  const loadStudents = useCallback(async () => {
    try {
      const data = await getClassStudents(classId);
      setStudents(data);
      // Initialize attendance data
      const initialAttendance = {};
      data.forEach(student => {
        initialAttendance[student.id] = 'PRESENT';
      });
      setAttendanceData(initialAttendance);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleAddGrade = async (e) => {
    e.preventDefault();
    try {
      await addGrade(gradeForm);
      setGradeForm({
        studentId: '',
        subject: '',
        score: '',
        maxScore: '100',
        term: 'Term 1',
        academicYear: '2024',
        remarks: ''
      });
      alert('Grade added successfully!');
    } catch (error) {
      console.error('Failed to add grade:', error);
      alert('Failed to add grade');
    }
  };

  const handleMarkAttendance = async () => {
    try {
      const attendanceArray = Object.entries(attendanceData).map(([studentId, status]) => ({
        studentId,
        date: attendanceDate,
        status,
        remarks: status === 'ABSENT' ? 'Marked by teacher' : null
      }));
      
      await markAttendance(attendanceArray);
      alert('Attendance marked successfully!');
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      alert('Failed to mark attendance');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-lg">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Class Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded ${activeTab === 'students' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Students ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`px-4 py-2 rounded ${activeTab === 'grades' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <BookOpen className="h-4 w-4 inline mr-2" />
            Add Grades
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded ${activeTab === 'attendance' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Mark Attendance
          </button>
        </div>

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Class Students</h3>
              {students.length === 0 ? (
                <p className="text-gray-600">No students in this class.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student) => (
                    <div key={student.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold">{student.firstName} {student.lastName}</h4>
                      <p className="text-sm text-gray-600">DOB: {new Date(student.dateOfBirth).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">
                        Parent: {student.parent?.user?.firstName} {student.parent?.user?.lastName}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Grades Tab */}
        {activeTab === 'grades' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Add Grade</h3>
              <form onSubmit={handleAddGrade} className="space-y-4 max-w-md">
                <select
                  value={gradeForm.studentId}
                  onChange={(e) => setGradeForm({...gradeForm, studentId: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Subject"
                  value={gradeForm.subject}
                  onChange={(e) => setGradeForm({...gradeForm, subject: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Score"
                    value={gradeForm.score}
                    onChange={(e) => setGradeForm({...gradeForm, score: e.target.value})}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Max Score"
                    value={gradeForm.maxScore}
                    onChange={(e) => setGradeForm({...gradeForm, maxScore: e.target.value})}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <select
                  value={gradeForm.term}
                  onChange={(e) => setGradeForm({...gradeForm, term: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
                <textarea
                  placeholder="Remarks (optional)"
                  value={gradeForm.remarks}
                  onChange={(e) => setGradeForm({...gradeForm, remarks: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows="3"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Add Grade
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Mark Attendance</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Date:</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="space-y-3">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">{student.firstName} {student.lastName}</span>
                    <div className="flex space-x-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`attendance-${student.id}`}
                          value="PRESENT"
                          checked={attendanceData[student.id] === 'PRESENT'}
                          onChange={(e) => setAttendanceData({...attendanceData, [student.id]: e.target.value})}
                          className="mr-1"
                        />
                        Present
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`attendance-${student.id}`}
                          value="ABSENT"
                          checked={attendanceData[student.id] === 'ABSENT'}
                          onChange={(e) => setAttendanceData({...attendanceData, [student.id]: e.target.value})}
                          className="mr-1"
                        />
                        Absent
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`attendance-${student.id}`}
                          value="LATE"
                          checked={attendanceData[student.id] === 'LATE'}
                          onChange={(e) => setAttendanceData({...attendanceData, [student.id]: e.target.value})}
                          className="mr-1"
                        />
                        Late
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleMarkAttendance}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Mark Attendance
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ClassManagement;
