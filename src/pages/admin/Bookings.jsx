// src/components/Booking.jsx
import React, { useState, useEffect } from 'react';
import {
  FiClock, FiCheckCircle, FiXCircle, FiPlus, FiCalendar,
  FiDollarSign, FiAlertCircle, FiChevronLeft, FiChevronRight,
  FiTrash2, FiUser, FiEdit
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} from '../../services/bookingService';
import { getServices } from '../../services/serviceService';
import { verifyUser } from '../../services/authService';

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userRole, setUserRole] = useState('USER');
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    notes: ''
  });

  const [editFormData, setEditFormData] = useState({
    id: '',
    serviceId: '',
    date: '',
    time: '',
    status: 'PENDING'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get user info to determine role
        const userInfo = await verifyUser();
        setUserRole(userInfo.role);
        
        // Load bookings based on role
        const bookingsData = userInfo.role === 'ADMIN' 
          ? await getAllBookings() 
          : await getUserBookings();
        setBookings(bookingsData);
        
        // Load services if user is not admin
        if (userInfo.role !== 'ADMIN') {
          const servicesData = await getServices();
          setServices(servicesData);
        }
      } catch (err) {
        handleError(err, 'Failed to load data');
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

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBooking(formData);
      setIsModalOpen(false);
      refreshBookings();
    } catch (err) {
      handleError(err, 'Failed to create booking');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBooking(editFormData.id, editFormData);
      setIsEditModalOpen(false);
      refreshBookings();
    } catch (err) {
      handleError(err, 'Failed to update booking');
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(id);
        refreshBookings();
      } catch (err) {
        handleError(err, 'Failed to delete booking');
      }
    }
  };

  const handleEdit = (booking) => {
    setEditFormData({
      id: booking.bookingId,
      serviceId: booking.serviceId,
      date: booking.date,
      time: booking.time,
      status: booking.status
    });
    setIsEditModalOpen(true);
  };

  const refreshBookings = async () => {
    try {
      const updatedBookings = userRole === 'ADMIN' 
        ? await getAllBookings() 
        : await getUserBookings();
      setBookings(updatedBookings);
    } catch (err) {
      handleError(err, 'Failed to refresh bookings');
    }
  };

  const handleError = (err, fallbackMsg) => {
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError(fallbackMsg);
    }
  };

  const statusBadge = (status) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium inline-flex items-center';
    switch (status) {
      case 'COMPLETED':
        return <span className={`${base} bg-green-100 text-green-700`}><FiCheckCircle className="mr-1" /> {status}</span>;
      case 'CONFIRMED':
        return <span className={`${base} bg-blue-100 text-blue-700`}><FiCheckCircle className="mr-1" /> {status}</span>;
      case 'PENDING':
        return <span className={`${base} bg-yellow-100 text-yellow-700`}><FiClock className="mr-1" /> {status}</span>;
      case 'CANCELLED':
        return <span className={`${base} bg-red-100 text-red-700`}><FiXCircle className="mr-1" /> {status}</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700`}><FiAlertCircle className="mr-1" /> {status}</span>;
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * bookingsPerPage;
  const indexOfFirst = indexOfLast - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {userRole === 'ADMIN' ? 'All Bookings' : 'My Bookings'}
        </h1>
        {userRole !== 'ADMIN' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FiPlus className="mr-2" /> New Booking
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
          <FiAlertCircle className="mr-2" /> {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading bookings...</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {userRole === 'ADMIN' && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <FiUser className="inline mr-1" /> User
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FiCalendar className="inline mr-1" /> Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <FiDollarSign className="inline mr-1" /> Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBookings.length === 0 ? (
                <tr>
                  <td colSpan={userRole === 'ADMIN' ? 6 : 5} className="text-center py-6 text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                currentBookings.map((booking) => (
                  <tr key={booking.bookingId} className="hover:bg-gray-50">
                    {userRole === 'ADMIN' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{booking.userName}</div>
                        <div className="text-sm text-gray-500">{booking.userEmail}</div>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{booking.serviceName}</div>
                      <div className="text-sm text-gray-500">{booking.serviceDescription}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.date} - {booking.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{booking.servicePrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {statusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {userRole === 'ADMIN' ? (
                        <>
                          <button
                            onClick={() => handleEdit(booking)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            title="Edit Booking"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(booking.bookingId)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Booking"
                          >
                            <FiTrash2 />
                          </button>
                        </>
                      ) : (
                        booking.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancel(booking.bookingId)}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel Booking"
                          >
                            <FiTrash2 />
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {bookings.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirst + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLast, bookings.length)}</span> of{' '}
                    <span className="font-medium">{bookings.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
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
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">New Booking</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Service</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} (₹{service.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special instructions..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Booking Modal (Admin Only) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Booking</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="editServiceId" className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <select
                  id="editServiceId"
                  name="serviceId"
                  value={editFormData.serviceId}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} (₹{service.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="editDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="editDate"
                  name="date"
                  value={editFormData.date}
                  onChange={handleEditInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="editTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  id="editTime"
                  name="time"
                  value={editFormData.time}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="editStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="editStatus"
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;