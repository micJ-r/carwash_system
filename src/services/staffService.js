import axiosInstance from '../api/axios';

export const getStaff = async () => {
  const response = await axiosInstance.get('/staff');
  return response.data;
};

export const createStaff = async (staffData) => {
  const response = await axiosInstance.post('/staff', staffData);
  return response.data;
};

export const updateStaff = async (id, staffData) => {
  const response = await axiosInstance.put(`/staff/${id}`, staffData);
  return response.data;
};

export const deleteStaff = async (id) => {
  await axiosInstance.delete(`/staff/${id}`);
};