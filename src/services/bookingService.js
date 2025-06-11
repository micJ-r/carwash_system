// src/services/bookingService.js
import axiosInstance from '../api/axios';

export const createBooking = async (bookingData) => {
  const response = await axiosInstance.post('/bookings', bookingData);
  return response.data;
};

export const getUserBookings = async () => {
  const response = await axiosInstance.get('/bookings');
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  await axiosInstance.delete(`/bookings/${bookingId}/cancel`);
};

// Admin functions
export const getAllBookings = async () => {
  const response = await axiosInstance.get('/bookings/admin');
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await axiosInstance.get(`/bookings/admin/${id}`);
  return response.data;
};

export const updateBooking = async (id, bookingData) => {
  const response = await axiosInstance.put(`/bookings/admin/${id}`, bookingData);
  return response.data;
};

export const deleteBooking = async (id) => {
  await axiosInstance.delete(`/bookings/admin/${id}`);
};