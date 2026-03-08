import api from './api';

export const getMyClasses = async () => {
  const response = await api.get('/teacher/classes');
  return response.data;
};

export const getClassStudents = async (classId) => {
  const response = await api.get(`/teacher/classes/${classId}/students`);
  return response.data;
};

export const addGrade = async (gradeData) => {
  const response = await api.post('/teacher/grades', gradeData);
  return response.data;
};

export const markAttendance = async (attendanceData) => {
  const response = await api.post('/teacher/attendance', { attendanceData });
  return response.data;
};