import axios from '../api/axios';

export const register = async (data) => {
  const response = await axios.post('/auth/register', data);
  return response.data;
};

export const login = async (data) => {
  const response = await axios.post('/auth/login', data);
  return response.data; // { id, username, email, role }
};

export const logout = async () => {
  const response = await axios.post('/auth/logout');
  return response.data;
};

export const verifyUser = async () => {
  const response = await axios.get('/auth/verify');
  return response.data; // { id, username, email, role }
};

export const refreshToken = async () => {
  const response = await axios.post('/auth/refresh');
  return response.data;
};