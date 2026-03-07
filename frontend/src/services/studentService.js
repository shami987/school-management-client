import api from './api';

export const getMyStudents = async () => {
  const response = await api.get('/students');
  return response.data;
};

export const getStudent = async (studentId) => {
  const response = await api.get(`/students/${studentId}`);
  return response.data;
};

export const getGrades = async (studentId) => {
  const response = await api.get(`/students/${studentId}/grades`);
  return response.data;
};

export const getAttendance = async (studentId) => {
  const response = await api.get(`/students/${studentId}/attendance`);
  return response.data;
};

export const getTimetable = async (studentId) => {
  const response = await api.get(`/students/${studentId}/timetable`);
  return response.data;
};
