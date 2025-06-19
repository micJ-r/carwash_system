// src/components/Bookings.jsx
import React, { useState, useEffect } from 'react';
import {
  FiClock, FiCheckCircle, FiXCircle, FiPlus,
  FiCalendar, FiDollarSign, FiAlertCircle,
  FiChevronLeft, FiChevronRight, FiTrash2,
  FiUser, FiEdit
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} from '../../services/bookingService';
import { toast } from 'react-toastify';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    timeSlotId: '',
    paymentMethod: 'CASH'
  });

  const [editFormData, setEditFormData] = useState({
    id: '',
    timeSlotId: '',
    status: 'PENDING'
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = user.role === 'ADMIN'
          ? await getAllBookings(currentPage, 10)
          : await getUserBookings(currentPage, 10);

        setBookings(result.bookings);
        setTotalPages(result.totalPages);
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to load bookings';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [currentPage, user]);

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      await createBooking(formData);
      toast.success('Booking created successfully');
      setIsModalOpen(false);
      setCurrentPage(1);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create booking';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    try {
      await updateBooking(editFormData.id, editFormData);
      toast.success('Booking updated successfully');
      setIsEditModalOpen(false);
      setCurrentPage(1);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update booking';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(id);
        toast.success('Booking cancelled successfully');
        setBookings(bookings.filter(b => b.id !== id));
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to cancel booking';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(id);
        toast.success('Booking deleted successfully');
        setBookings(bookings.filter(b => b.id !== id));
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to delete booking';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    }
  };

  const StatusBadge = ({ status }) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium inline-flex items-center';
    const statusStyles = {
      COMPLETED: 'bg-green-100 text-green-700',
      CONFIRMED: 'bg-blue-100 text-blue-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      CANCELLED: 'bg-red-100 text-red-700'
    };

    return (
      <span className={`${base} ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  if (!user) return <div className="p-4">Please log in to view bookings.</div>;
  if (loading) return <div className="p-4">Loading bookings...</div>;
  if (error) return (
    <div className="p-4 text-red-500 flex items-center">
      <FiAlertCircle className="mr-2" /> Error: {error}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {user.role === 'ADMIN' ? 'All Bookings' : 'My Bookings'}
        </h1>
        {user.role !== 'ADMIN' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
          >
            <FiPlus className="mr-1" /> New Booking
          </button>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {user.role === 'ADMIN' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map(booking => (
              <tr key={booking.id}>
                {user.role === 'ADMIN' && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.userName}</div>
                    <div className="text-sm text-gray-500">{booking.userId}</div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.serviceName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(booking.date).toLocaleDateString()} at {booking.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${booking.servicePrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {user.role === 'ADMIN' ? (
                    <>
                      <button
                        onClick={() => {
                          setEditFormData({
                            id: booking.id,
                            timeSlotId: booking.timeSlotId || '',
                            status: booking.status
                          });
                          setIsEditModalOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  ) : (
                    booking.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiXCircle />
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center px-6 py-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
          >
            <FiChevronLeft />
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">New Booking</h2>
            <form onSubmit={handleCreateBooking}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Time Slot ID</label>
                <input
                  type="number"
                  value={formData.timeSlotId}
                  onChange={(e) => setFormData({ ...formData, timeSlotId: e.target.value })}
                  className="border border-gray-300 rounded-md p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
            <form onSubmit={handleUpdateBooking}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Time Slot ID</label>
                <input
                  type="number"
                  value={editFormData.timeSlotId}
                  onChange={(e) => setEditFormData({ ...editFormData, timeSlotId: e.target.value })}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;