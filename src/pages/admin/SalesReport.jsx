// src/components/SalesReport.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { generateSalesReport } from '../../services/reportService';
import { toast } from 'react-toastify';
import { FiCalendar, FiDollarSign, FiList } from 'react-icons/fi';

function SalesReport() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please select start and end dates');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await generateSalesReport(startDate, endDate, period);
      setReport(data);
      toast.success('Sales report generated successfully');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to generate report';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return <p className="text-center mt-10 text-red-500">Access denied. Admin only.</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Sales Report</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
          <FiAlertCircle className="mr-2" /> {error}
        </div>
      )}
      <form onSubmit={handleGenerateReport} className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Period</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="self-end bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </form>
      {report && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Report Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <FiCalendar className="text-blue-500 mr-2" />
              <p>
                <span className="font-medium">Date Range:</span>{' '}
                {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center">
              <FiDollarSign className="text-green-500 mr-2" />
              <p>
                <span className="font-medium">Total Revenue:</span> ${report.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center">
              <FiList className="text-purple-500 mr-2" />
              <p>
                <span className="font-medium">Total Bookings:</span> {report.totalBookings}
              </p>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-4">Bookings</h3>
          {report.bookings.length === 0 ? (
            <p className="text-gray-500">No bookings found for this period.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.serviceName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.userName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${booking.paymentAmount ? booking.paymentAmount.toFixed(2) : '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SalesReport;