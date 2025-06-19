import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';

function DashboardUser() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newBooking, setNewBooking] = useState({
    serviceId: '',
    date: '',
    timeSlotId: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('');

  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/bookings?page=${page}&limit=10`);
      setBookings(response.data.bookings || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
    } catch (err) {
      console.error('Failed to fetch bookings:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to load bookings.');
      setBookings([]);
      if (err.response?.status === 401) {
        await logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('/services');
      setServices(response.data || []);
    } catch (err) {
      console.error('Failed to fetch services:', err.response?.data || err.message);
      setError('Failed to load services.');
    }
  };

  const fetchTimeSlots = async (serviceId, date) => {
    if (!serviceId || !date) return;
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/timeslots/available?serviceId=${serviceId}&date=${date}`);
      setTimeSlots(response.data || []);
    } catch (err) {
      console.error('Failed to fetch time slots:', err.response?.data || err.message);
      setError('Failed to load time slots.');
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/bookings', newBooking);
      setBookings([...bookings, response.data]);
      setNewBooking({ serviceId: '', date: '', timeSlotId: '' });
      setTimeSlots([]);
      alert('Booking created successfully!');
    } catch (err) {
      console.error('Failed to create booking:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to create booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      setLoading(true);
      setError(null);
      await axios.put(`/bookings/${bookingId}/cancel`, {});
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
      alert('Booking cancelled successfully!');
    } catch (err) {
      console.error('Failed to cancel booking:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to cancel booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (bookingId) => {
    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await axios.post(`/bookings/${bookingId}/payment`, { paymentMethod });
      alert('Payment processed successfully!');
      fetchBookings(currentPage);
    } catch (err) {
      console.error('Failed to process payment:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to process payment.');
    } finally {
      setLoading(false);
      setPaymentMethod('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking((prev) => ({ ...prev, [name]: value }));
    if (name === 'serviceId' || name === 'date') {
      fetchTimeSlots(newBooking.serviceId, newBooking.date);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
      fetchServices();
    }
  }, [user]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchBookings(page);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.username || 'User'} ({user?.role})
          </h2>
          <button
            onClick={logout}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-md">{error}</div>
        )}

        {loading && (
          <div className="flex justify-center items-center mb-6">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        <div className="bg-white p-6 rounded-md shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Booking</h3>
          <form onSubmit={handleCreateBooking} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Service</label>
              <select
                name="serviceId"
                value={newBooking.serviceId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} (${service.price})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={newBooking.date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Time Slot</label>
              <select
                name="timeSlotId"
                value={newBooking.timeSlotId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
                disabled={!newBooking.serviceId || !newBooking.date}
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.startTime} - {slot.endTime}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              Book Now
            </button>
          </form>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Bookings</h3>
        {bookings.length === 0 ? (
          <p className="text-gray-600">No bookings found.</p>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white p-4 rounded-md shadow-md">
                <p><strong>ID:</strong> {booking.id}</p>
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Service:</strong> {booking.serviceName}</p>
                <p><strong>Status:</strong> {booking.status}</p>
                {booking.status !== 'CANCELLED' && (
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    {booking.status === 'CONFIRMED' && (
                      <div className="flex space-x-2">
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="p-1 border rounded-md"
                        >
                          <option value="">Select Payment Method</option>
                          <option value="CREDIT_CARD">Credit Card</option>
                          <option value="DEBIT_CARD">Debit Card</option>
                          <option value="CASH">Cash</option>
                        </select>
                        <button
                          onClick={() => handleProcessPayment(booking.id)}
                          className="bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition"
                          disabled={loading || !paymentMethod}
                        >
                          Pay Now
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition"
              disabled={currentPage === 1 || loading}
            >
              Previous
            </button>
            <span className="py-2 px-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition"
              disabled={currentPage === totalPages || loading}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardUser;