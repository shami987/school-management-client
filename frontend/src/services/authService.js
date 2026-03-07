import api from './api';
import { v4 as uuidv4 } from 'uuid';

// Get or create device ID
export const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

// Get device name
export const getDeviceName = () => {
  const userAgent = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';

  if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
  else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
  else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
  else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';

  if (userAgent.indexOf('Win') > -1) os = 'Windows';
  else if (userAgent.indexOf('Mac') > -1) os = 'MacOS';
  else if (userAgent.indexOf('Linux') > -1) os = 'Linux';

  return `${browser} on ${os}`;
};

export const register = async (data) => {
  const deviceId = getDeviceId();
  const deviceName = getDeviceName();
  const response = await api.post('/auth/register', {
    ...data,
    deviceId,
    deviceName,
  });
  return response.data;
};

export const login = async (email, password) => {
  const deviceId = getDeviceId();
  const response = await api.post('/auth/login', {
    email,
    password,
    deviceId,
  });
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
