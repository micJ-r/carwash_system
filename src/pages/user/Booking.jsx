// src/components/user/UserBookings.jsx
import React, { useState, useEffect } from 'react';
import {
  FiClock, FiCheckCircle, FiXCircle, FiPlus, 
  FiCalendar, FiDollarSign, FiTrash2, FiAlertCircle
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getUserBookings, cancelBooking } from '../../services/bookingService';
import { getServices } from '../../services/serviceService';
import { verifyUser } from '../../services/authService';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await verifyUser(); // Ensure user is authenticated
        
        const [bookingsData, servicesData] = await Promise.all([
          getUserBookings(),
          getServices()
        ]);
        
        setBookings(bookingsData);
        setServices(servicesData);
      } catch (err) {
        handleError(err, 'Failed to load bookings');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add create booking logic here
      setIsModalOpen(false);
      refreshBookings();
    } catch (err) {
      handleError(err, 'Failed to create booking');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(id);
        refreshBookings();
      } catch (err) {
        handleError(err, 'Failed to cancel booking');
      }
    }
  };

  const refreshBookings = async () => {
    try {
      const updatedBookings = await getUserBookings();
      setBookings(updatedBookings);
    } catch (err) {
      handleError(err, 'Failed to refresh bookings');
    }
  };

  const handleError = (err, fallbackMsg) => {
    const errorMsg = err.response?.data?.message || err.message || fallbackMsg;
    setError(errorMsg);
  };

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
      default:
        return <span className={`${base} bg-gray-100 text-gray-700`}><FiAlertCircle className="mr-1" /> Unknown</span>;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FiPlus className="mr-2" /> New Booking
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
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
          >
            Make Your First Booking
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{booking.serviceName}</h3>
                  <p className="text-gray-600 text-sm">{booking.serviceDescription}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">₹{booking.servicePrice.toFixed(2)}</div>
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
                  >
                    <FiTrash2 className="mr-1" /> Cancel
                  </button>
                )}
              </div>
              
              {booking.notes && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Notes:</span> {booking.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">New Booking</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <select
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select a service</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} (₹{service.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Special instructions..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookings;