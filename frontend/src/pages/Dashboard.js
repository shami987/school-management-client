import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyStudents } from '../services/studentService';
import { getMyClasses } from '../services/teacherService';
import { getMyProfile } from '../services/studentUserService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      if (user?.role === 'PARENT') {
        const response = await getMyStudents();
        setData(response.students || []);
      } else if (user?.role === 'TEACHER') {
        const classes = await getMyClasses();
        setData(classes || []);
      } else if (user?.role === 'STUDENT') {
        const profile = await getMyProfile();
        setData([profile] || []);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getTitle = () => {
    switch (user?.role) {
      case 'PARENT': return 'My Children';
      case 'TEACHER': return 'My Classes';
      case 'STUDENT': return 'My Profile';
      default: return 'Dashboard';
    }
  };

  const renderContent = () => {
    if (loading) return <div className="text-center py-8">Loading...</div>;
    
    if (data.length === 0) {
      const emptyMessage = {
        PARENT: 'No students found. Contact admin to add your children.',
        TEACHER: 'No classes assigned. Contact admin.',
        STUDENT: 'Profile not found.'
      };
      return (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">{emptyMessage[user?.role] || 'No data found.'}</p>
        </div>
      );
    }

    if (user?.role === 'PARENT') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/student/${student.id}`)}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-gray-600 text-sm mb-1">
                  Class: {student.class?.name || 'Not assigned'}
                </p>
                <p className="text-gray-600 text-sm">
                  Grade: {student.class?.grade || 'N/A'}
                </p>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (user?.role === 'TEACHER') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((classItem) => (
            <div key={classItem.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {classItem.name}
                </h3>
                <p className="text-gray-600 text-sm mb-1">
                  Grade: {classItem.grade} {classItem.section}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  Students: {classItem._count?.students || 0}
                </p>
                <p className="text-gray-600 text-sm">
                  Academic Year: {classItem.academicYear}
                </p>
                <button 
                  onClick={() => navigate(`/class/${classItem.id}`)}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Manage Class
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (user?.role === 'STUDENT') {
      const profile = data[0];
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Student Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600"><strong>Name:</strong> {profile?.firstName} {profile?.lastName}</p>
              <p className="text-gray-600"><strong>Email:</strong> {profile?.email}</p>
            </div>
            <div>
              <p className="text-gray-600"><strong>Class:</strong> {profile?.student?.class?.name || 'Not assigned'}</p>
              <p className="text-gray-600"><strong>Grade:</strong> {profile?.student?.class?.grade || 'N/A'}</p>
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <button 
              onClick={() => navigate('/my-grades')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Grades
            </button>
            <button 
              onClick={() => navigate('/my-attendance')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              View Attendance
            </button>
            <button 
              onClick={() => navigate('/my-timetable')}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              View Timetable
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">School Management</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome, {user?.firstName} {user?.lastName} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{getTitle()}</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
