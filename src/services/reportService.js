// src/services/reportService.js
import axios from '../api/axios';

export const generateSalesReport = async (startDate, endDate, period) => {
  try {
    const response = await axios.get('/reports/sales', {
      params: { startDate, endDate, period },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};