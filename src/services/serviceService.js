// src/services/serviceService.js
import axiosInstance from '../api/axios';

export const getServices = async () => {
  const response = await axiosInstance.get('/services');
  return response.data;
};

export const createService = async (serviceData) => {
  const response = await axiosInstance.post('/services', serviceData);
  return response.data;
};

export const updateService = async (id, serviceData) => {
  const response = await axiosInstance.put(`/services/${id}`, serviceData);
  return response.data;
};

export const deleteService = async (id) => {
  await axiosInstance.delete(`/services/${id}`);
};