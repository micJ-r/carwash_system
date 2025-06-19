// src/services/paymentService.js
import axiosInstance from '../api/axios';

export const processPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

export const getPaymentByBookingId = async (bookingId) => {
  try {
    const response = await axiosInstance.get(`/payments/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment by booking ID:', error);
    throw error;
  }
};

export const getAllPayments = async (page = 1, limit = 5, search = '', status = '') => {
  try {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(status && status !== 'All' && { status })
    }).toString();
    const response = await axiosInstance.get(`/payments/admin?${queryParams}`);
    return {
      payments: response.data.payments,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage
    };
  } catch (error) {
    console.error('Error fetching all payments:', error);
    throw error;
  }
};