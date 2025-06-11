// src/services/authService.js
import axiosInstance from '../api/axios';

export const login = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

export const logout = async () => {
  await axiosInstance.post('/auth/logout');
};

export const verifyUser = async () => {
  const response = await axiosInstance.get('/auth/verify');
  return response.data;
};

export const refreshToken = async () => {
  const response = await axiosInstance.post('/auth/refresh');
  return response.data;
};