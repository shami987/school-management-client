import api from './api';

export const getMyProfile = async () => {
  const response = await api.get('/student/profile');
  return response.data;
};

export const getMyGrades = async () => {
  const response = await api.get('/student/grades');
  return response.data;
};

export const getMyAttendance = async () => {
  const response = await api.get('/student/attendance');
  return response.data;
};

export const getMyTimetable = async () => {
  const response = await api.get('/student/timetable');
  return response.data;
};