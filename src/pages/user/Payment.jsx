import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';

function Payment() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    bookingId: '',
    paymentMethod: 'CREDIT_CARD',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.bookingId) return 'Booking ID is required';
    if (!formData.paymentMethod) return 'Payment method is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to process payment');
      toast.error('Please log in to process payment');
      navigate('/login');
      return;
    }
    const errorMsg = validateForm();
    if (errorMsg) {
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `/bookings/${formData.bookingId}/payment`,
        { paymentMethod: formData.paymentMethod },
        { withCredentials: true }
      );
      toast.success('Payment processed successfully!');
      navigate('/user/history');
    } catch (err) {
      console.error('Payment error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.error || 'Failed to process payment';
      setError(errorMsg);
      toast.error(errorMsg);
      if (err.response?.status === 401) {
        await logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <p className="text-red-500">Please log in to process payments.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Process Payment</h2>
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <FiAlertCircle className="mr-2" /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
            <input
              type="text"
              name="bookingId"
              value={formData.bookingId}
              onChange={handleChange}
              placeholder="Enter Booking ID"
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500"
              aria-label="Booking ID input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500"
              required
              aria-label="Select payment method"
            >
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="CASH">Cash</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Submit payment"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Payment;