import React, { useEffect, useState } from 'react';
import { FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusBadge = (status) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium';
    if (status === 'COMPLETED') return <span className={`${base} bg-green-100 text-green-700`}><FiCheckCircle className="inline mr-1" /> {status}</span>;
    if (status === 'PENDING') return <span className={`${base} bg-yellow-100 text-yellow-700`}><FiClock className="inline mr-1" /> {status}</span>;
    return <span className={`${base} bg-red-100 text-red-700`}><FiXCircle className="inline mr-1" /> {status}</span>;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/bookings', {
          method: 'GET',
          credentials: 'include', // VERY IMPORTANT for cookies
        });

        if (!res.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Bookings</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Service</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Description</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Price</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Time</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No bookings available.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4">{booking.serviceName}</td>
                  <td className="px-6 py-4">{booking.description}</td>
                  <td className="px-6 py-4">₹{booking.price}</td>
                  <td className="px-6 py-4">{booking.date}</td>
                  <td className="px-6 py-4">{booking.time}</td>
                  <td className="px-6 py-4">{statusBadge(booking.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Bookings;
