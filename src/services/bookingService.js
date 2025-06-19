// src/services/bookingService.js
import axiosInstance from '../api/axios';

export const createBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post('/bookings', bookingData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getUserBookings = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(`/bookings?page=${page}&limit=${limit}`);
    return {
      bookings: response.data.bookings,
      totalPages: response.data.totalPages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    await axiosInstance.delete(`/bookings/${bookingId}/cancel`);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

export const getAllBookings = async (page = 1, limit = 10, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await axiosInstance.get(`/bookings/admin?${queryParams}`);
    return {
      bookings: response.data.bookings,
      totalPages: response.data.totalPages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    throw error;
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await axiosInstance.get(`/bookings/admin/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    throw error;
  }
};

export const updateBooking = async (id, bookingData) => {
  try {
    const response = await axiosInstance.put(`/bookings/admin/${id}`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

export const deleteBooking = async (id) => {
  try {
    await axiosInstance.delete(`/bookings/admin/${id}`);
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

const bookingService = {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking
};

export default bookingService;