import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FiCalendar, FiCheckCircle, FiXCircle, FiAlertCircle, FiClock } from 'react-icons/fi';

function History() {
  const { user } = useAuth();
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
        console.log('Fetching bookings for page:', currentPage);
        const response = await axios.get(`/bookings?page=${currentPage}&limit=10`, { withCredentials: true });
        console.log('Bookings response:', response.data);

        // Fetch payment status for each booking
        const bookingsWithPayment = await Promise.all(
          response.data.bookings.map(async (booking) => {
            try {
              const paymentResponse = await axios.get(`/payments/booking/${booking.id}`, { withCredentials: true });
              return { ...booking, paymentStatus: paymentResponse.data.status || 'PENDING' };
            } catch (err) {
              console.warn(`Failed to fetch payment for booking ${booking.id}:`, err);
              return { ...booking, paymentStatus: 'PENDING' };
            }
          })
        );

        setBookings(bookingsWithPayment);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        const errorMsg = err.response?.data?.error || 'Failed to load history';
        setError(errorMsg);
        toast.error(errorMsg);
        if (err.response?.status === 401) {
          toast.error('Session expired, please log in again');
        } else if (err.response?.status === 403) {
          toast.error('Access denied');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, currentPage]);

  const statusBadge = (status) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium inline-flex items-center';
    switch (status) {
      case 'COMPLETED':
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            <FiCheckCircle className="mr-1" /> Completed
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
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-700`}>
            <FiAlertCircle className="mr-1" /> Unknown
          </span>
        );
    }
  };

  if (!user) return <p className="text-center mt-10 text-lg">Please log in to view your history.</p>;
  if (loading) return <p className="text-center mt-10 text-lg">Loading history...</p>;

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
          {bookings.map((booking) => {
            const bookingDate = new Date(booking.date);
            const dateStr = bookingDate.toLocaleDateString();
            const timeStr = bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={booking.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{booking.serviceName}</h3>
                    <p className="text-gray-600 text-sm">{booking.serviceDescription || 'No description'}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">${(booking.servicePrice || 0).toFixed(2)}</div>
                    {statusBadge(booking.status)}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-2" />
                    <span>{`${dateStr} at ${timeStr}`}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Payment: {statusBadge(booking.paymentStatus || 'PENDING')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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