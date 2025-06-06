import React, { useState } from 'react';
import { 
  FiBarChart2,
  FiPieChart,
  FiDollarSign,
  FiCalendar,
  FiDownload,
  FiFilter,
  FiRefreshCw,
  FiPrinter
} from 'react-icons/fi';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function Reports() {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState('week');
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample data for charts
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [1250, 1900, 1800, 2100, 2500, 2300],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }
    ]
  };

  const serviceDistributionData = {
    labels: ['Basic Wash', 'Premium Wash', 'Interior Detailing', 'Full Service'],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const customerTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Customers',
        data: [15, 22, 18, 25, 28, 30],
        fill: false,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.1
      },
      {
        label: 'Repeat Customers',
        data: [35, 42, 38, 45, 48, 50],
        fill: false,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        tension: 0.1
      }
    ]
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      alert('Report generated successfully!');
    }, 1500);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
          <FiBarChart2 className="mr-2" /> Reports Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
          >
            <FiRefreshCw className={`mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'sales' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center">
                <FiDollarSign className="mr-2" /> Sales
              </div>
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'services' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center">
                <FiPieChart className="mr-2" /> Service Distribution
              </div>
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'customers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center">
                <FiBarChart2 className="mr-2" /> Customer Trends
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Sales Report */}
        {activeTab === 'sales' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Sales Performance</h2>
              <div className="flex space-x-2">
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                  <FiDownload className="mr-1" /> Export
                </button>
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                  <FiPrinter className="mr-1" /> Print
                </button>
              </div>
            </div>
            <div className="h-96">
              <Bar 
                data={salesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Monthly Revenue'
                    }
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                <p className="text-2xl font-bold mt-1">$12,050</p>
                <p className="text-xs text-green-500 mt-1">↑ 12% from last period</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Average Order Value</h3>
                <p className="text-2xl font-bold mt-1">$32.50</p>
                <p className="text-xs text-green-500 mt-1">↑ 5% from last period</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Total Services</h3>
                <p className="text-2xl font-bold mt-1">371</p>
                <p className="text-xs text-green-500 mt-1">↑ 8% from last period</p>
              </div>
            </div>
          </div>
        )}

        {/* Service Distribution Report */}
        {activeTab === 'services' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Service Distribution</h2>
              <div className="flex space-x-2">
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                  <FiDownload className="mr-1" /> Export
                </button>
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                  <FiPrinter className="mr-1" /> Print
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96">
                <Bar 
                  data={serviceDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      title: {
                        display: true,
                        text: 'Service Popularity'
                      }
                    }
                  }}
                />
              </div>
              <div className="h-96">
                <Pie 
                  data={serviceDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right'
                      },
                      title: {
                        display: true,
                        text: 'Service Breakdown'
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Service Performance</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bookings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Rating</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Basic Wash</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">130</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$2,080.00</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4.2 ★</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Premium Wash</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">93</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$2,787.00</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4.5 ★</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Interior Detailing</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">74</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$3,626.00</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4.7 ★</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Full Service</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">74</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$3,626.00</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4.8 ★</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Customer Trends Report */}
        {activeTab === 'customers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Customer Trends</h2>
              <div className="flex space-x-2">
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                  <FiDownload className="mr-1" /> Export
                </button>
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                  <FiPrinter className="mr-1" /> Print
                </button>
              </div>
            </div>
            <div className="h-96">
              <Line 
                data={customerTrendsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Customer Growth'
                    }
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
                <p className="text-2xl font-bold mt-1">243</p>
                <p className="text-xs text-green-500 mt-1">↑ 15% from last period</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Repeat Rate</h3>
                <p className="text-2xl font-bold mt-1">68%</p>
                <p className="text-xs text-green-500 mt-1">↑ 7% from last period</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-500">Avg. Visits</h3>
                <p className="text-2xl font-bold mt-1">3.2</p>
                <p className="text-xs text-green-500 mt-1">↑ 0.4 from last period</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;