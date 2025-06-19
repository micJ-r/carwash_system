import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FaCalendar, FaCar, FaTasks, FaUser } from 'react-icons/fa';

function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || !user.id) {
        toast.error('User not authenticated');
        setLoading(false);
        return;
      }
      try {
        console.log('Fetching bookings for staff ID:', user.id);
        const response = await axios.get(`/bookings/staff/${user.id}`, { withCredentials: true });
        console.log('Bookings response:', response.data);
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        const message = err.response?.data?.error || 'Failed to load bookings';
        toast.error(message);
        if (err.response?.status === 401) {
          toast.error('Session expired, please log in again');
        } else if (err.response?.status === 403) {
          toast.error('Access denied: Staff role required');
        }
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchBookings();
  }, [user]);

  const todayBookings = bookings.filter(
    (booking) => new Date(booking.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FaUser className="mr-2 text-blue-600" />
          Welcome, {user?.username || 'Staff'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <FaCalendar className="text-blue-600 text-3xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Bookings Today</h3>
              <p className="text-2xl font-bold text-blue-600">{todayBookings.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <FaTasks className="text-blue-600 text-3xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Assigned</h3>
              <p className="text-2xl font-bold text-blue-600">{bookings.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <FaCar className="text-blue-600 text-3xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Pending Tasks</h3>
              <p className="text-2xl font-bold text-blue-600">
                {bookings.filter((b) => b.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Upcoming Bookings</h3>
            <Link
              to="/staff/bookings"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              aria-label="View all bookings"
            >
              View All
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-gray-600">No bookings assigned.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Customer</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings
                    .filter((b) => new Date(b.date) >= new Date())
                    .slice(0, 5)
                    .map((booking) => (
                      <tr key={booking.id} className="border-b">
                        <td className="py-2">{booking.customerName}</td>
                        <td className="py-2">{new Date(booking.date).toLocaleString()}</td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              booking.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : booking.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;