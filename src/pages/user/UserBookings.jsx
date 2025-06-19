import React, { useState, useEffect } from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiPlus, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/common/Modal'; // Import Modal

function UserBookings() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [formData, setFormData] = useState({
    serviceId: state?.serviceId || '',
    date: '',
    timeSlotId: '',
  });

  // Fetch bookings, services, and time slots
  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/bookings?page=${page}&limit=10`, { withCredentials: true });
      setBookings(response.data.bookings || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
    } catch (err) {
      handleError(err, 'Failed to load bookings');
      if (err.response?.status === 401) {
        await logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('/services', { withCredentials: true });
      setServices(response.data || []);
    } catch (err) {
      handleError(err, 'Failed to load services');
    }
  };

  const fetchTimeSlots = async (serviceId, date) => {
    if (!serviceId || !date) return;
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/timeslots/available?serviceId=${serviceId}&date=${date}`, {
        withCredentials: true,
      });
      setTimeSlots(response.data || []);
    } catch (err) {
      handleError(err, 'Failed to load time slots');
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a new booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }
    try {
      setLoading(true);
      setError('');
      const response = await axios.post('/bookings', formData, { withCredentials: true });
      setBookings([...bookings, response.data]);
      toast.success('Booking created successfully!');
      setIsModalOpen(false);
      setFormData({ serviceId: '', date: '', timeSlotId: '' });
      setTimeSlots([]);
      fetchBookings(currentPage);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.details?.message || 'Failed to create booking';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Cancel a booking
  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      setLoading(true);
      setError('');
      await axios.put(`/bookings/${id}/cancel`, {}, { withCredentials: true });
      toast.success('Booking cancelled successfully!');
      fetchBookings(currentPage);
    } catch (err) {
      handleError(err, 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes and fetch time slots
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'serviceId' || name === 'date') {
      fetchTimeSlots(formData.serviceId, formData.date);
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.serviceId) return 'Please select a service';
    if (!formData.date) return 'Please select a date';
    if (!formData.timeSlotId) return 'Please select a time slot';
    return null;
  };

  // Handle errors
  const handleError = (err, fallbackMsg) => {
    const errorMsg = err.response?.data?.error || err.response?.data?.details?.message || err.message || fallbackMsg;
    setError(errorMsg);
    toast.error(errorMsg);
  };

  // Status badge
  const statusBadge = (status) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium inline-flex items-center';
    switch (status) {
      case 'COMPLETED':
        return <span className={`${base} bg-green-100 text-green-700`}><FiCheckCircle className="mr-1" /> Completed</span>;
      case 'CONFIRMED':
        return <span className={`${base} bg-blue-100 text-blue-700`}><FiCheckCircle className="mr-1" /> Confirmed</span>;
      case 'PENDING':
        return <span className={`${base} bg-yellow-100 text-yellow-700`}><FiClock className="mr-1" /> Pending</span>;
      case 'CANCELLED':
        return <span className={`${base} bg-red-100 text-red-700`}><FiXCircle className="mr-1" /> Cancelled</span>;
      case 'FAILED':
        return <span className={`${base} bg-red-100 text-red-700`}><FiXCircle className="mr-1" /> Failed</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700`}><FiAlertCircle className="mr-1" /> Unknown</span>;
    }
  };

  // Fetch initial data
  useEffect(() => {
    if (user) {
      fetchBookings();
      fetchServices();
      if (formData.serviceId && formData.date) {
        fetchTimeSlots(formData.serviceId, formData.date);
      }
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          aria-label="Create new booking"
        >
          <FiPlus className="mr-2" /> New Booking
        </button>
      </div>
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <FiAlertCircle className="mr-2" /> {error}
        </div>
      )}
      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            aria-label="Make your first booking"
          >
            Make Your First Booking
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{booking.serviceName}</h3>
                  <p className="text-gray-600 text-sm">{booking.serviceDescription}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">${booking.price?.toFixed(2)}</div>
                  {statusBadge(booking.status)}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="mr-2" />
                  <span>{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
                </div>
                {booking.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="text-red-600 hover:text-red-800 flex items-center text-sm"
                    aria-label={`Cancel booking ${booking.id}`}
                  >
                    <FiXCircle className="mr-1" /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
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
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Booking">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <select
              name="serviceId"
              value={formData.serviceId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500"
              required
              aria-label="Select service"
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} (${service.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500"
              aria-label="Select date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
            <select
              name="timeSlotId"
              value={formData.timeSlotId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500"
              required
              disabled={!formData.serviceId || !formData.date}
              aria-label="Select time slot"
            >
              <option value="">Select a time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.startTime} - {slot.endTime}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
              aria-label="Cancel booking"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Confirm booking"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default UserBookings;