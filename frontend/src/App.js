import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentDetail from './pages/StudentDetail';
import ClassManagement from './pages/ClassManagement';
import StudentGrades from './pages/StudentGrades';
import StudentAttendance from './pages/StudentAttendance';
import StudentTimetable from './pages/StudentTimetable';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/:studentId"
            element={
              <PrivateRoute>
                <StudentDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/class/:classId"
            element={
              <PrivateRoute>
                <ClassManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-grades"
            element={
              <PrivateRoute>
                <StudentGrades />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-attendance"
            element={
              <PrivateRoute>
                <StudentAttendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-timetable"
            element={
              <PrivateRoute>
                <StudentTimetable />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
