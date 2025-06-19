import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FiCalendar, FiCheckCircle, FiXCircle, FiAlertCircle, FiClock } from 'react-icons/fi';

function BookingsStaff() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || !user.id) {
        setError('User not authenticated');
        toast.error('User not authenticated');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        console.log('Fetching bookings for staff ID:', user.id);
        const response = await axios.get(`/bookings/staff/${user.id}`, { withCredentials: true });
        console.log('Bookings response:', response.data);
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        const errorMsg = err.response?.data?.error || 'Failed to load bookings';
        setError(errorMsg);
        toast.error(errorMsg);
        if (err.response?.status === 401) {
          toast.error('Session expired, please log in again');
        } else if (err.response?.status === 403) {
          toast.error('Access denied: Staff role required');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      console.log('Updating booking ID:', bookingId, 'to status:', newStatus);
      await axios.put(
        `/bookings/${bookingId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success('Booking status updated!');
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error('Error updating booking status:', err);
      const errorMsg = err.response?.data?.error || 'Failed to update booking status';
      toast.error(errorMsg);
    }
  };

  const statusBadge = (status) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium inline-flex items-center';
    switch (status) {
      case 'COMPLETED':
        return <span className={`${base} bg-green-100 text-green-700`}><FiCheckCircle className="mr-1" /> Completed</span>;
      case 'PENDING':
        return <span className={`${base} bg-yellow-100 text-yellow-700`}><FiClock className="mr-1" /> Pending</span>;
      case 'CANCELLED':
        return <span className={`${base} bg-red-100 text-red-700`}><FiXCircle className="mr-1" /> Cancelled</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700`}><FiAlertCircle className="mr-1" /> Unknown</span>;
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading bookings...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Bookings</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
          <FiAlertCircle className="mr-2" /> {error}
        </div>
      )}
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings available.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => {
                const bookingDate = new Date(booking.date);
                const dateStr = bookingDate.toLocaleDateString();
                const timeStr = bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.serviceName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{`${dateStr} at ${timeStr}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{statusBadge(booking.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className="border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-blue-500"
                        aria-label={`Update status for booking ${booking.id}`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookingsStaff;