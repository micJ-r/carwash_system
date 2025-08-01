import React, { useState, useEffect } from 'react';
import {
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiClock,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';

function History() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`/bookings?page=${currentPage}&limit=10`, {
          withCredentials: true,
        });
        setBookings(response.data.bookings || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.error('Failed to load bookings:', err.response?.data || err.message);
        const errorMsg = err.response?.data?.error || 'Failed to load history';
        setError(errorMsg);
        toast.error(errorMsg);
        if (err.response?.status === 401) {
          await logout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user, currentPage, logout]);

  const statusBadge = (status) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium inline-flex items-center';
    switch (status) {
      case 'COMPLETED':
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            <FiCheckCircle className="mr-1" /> Completed
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>
            <FiCheckCircle className="mr-1" /> Confirmed
          </span>
        );
      case 'PENDING':
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>
            <FiClock className="mr-1" /> Pending
          </span>
        );
      case 'CANCELLED':
        return (
          <span className={`${base} bg-red-100 text-red-700`}>
            <FiXCircle className="mr-1" /> Cancelled
          </span>
        );
      case 'FAILED':
        return (
          <span className={`${base} bg-red-100 text-red-700`}>
            <FiXCircle className="mr-1" /> Failed
          </span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-700`}>
            <FiAlertCircle className="mr-1" /> Unknown
          </span>
        );
    }
  };

  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-center text-lg text-red-500">
          Please log in to view your history.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-center text-lg text-gray-600">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Booking History</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
          <FiAlertCircle className="mr-2" /> {error}
        </div>
      )}
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No booking history available.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {booking.serviceName}
                  </h3>
                  <p className="text-gray-600 text-sm">{booking.serviceDescription}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    ${booking.price?.toFixed(2)}
                  </div>
                  {statusBadge(booking.status)}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="mr-2" />
                  <span>
                    {new Date(booking.date).toLocaleDateString()} at {booking.time}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Payment: {statusBadge(booking.paymentStatus || 'PENDING')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav
            className="inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === page
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

export default History;