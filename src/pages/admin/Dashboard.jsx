import React from 'react';
import { 
  FiCalendar, 
  FiUsers, 
  FiDollarSign, 
  FiActivity,
  FiTrendingUp,
  FiAlertCircle,
  FiBarChart2,
  FiPieChart,
  FiRefreshCw
} from 'react-icons/fi';

function DashboardAdmin() {
  // Mock data
  const stats = [
    { title: "Today's Bookings", value: 24, change: "+12%", icon: <FiCalendar className="text-blue-500" /> },
    { title: "Active Customers", value: 156, change: "+5%", icon: <FiUsers className="text-green-500" /> },
    { title: "Revenue", value: "$3,845", change: "+18%", icon: <FiDollarSign className="text-purple-500" /> },
    { title: "Pending Services", value: 8, change: "-2", icon: <FiAlertCircle className="text-yellow-500" /> }
  ];

  const recentBookings = [
    { id: 1, customer: "John Doe", service: "Full Wash", time: "10:30 AM", status: "Completed" },
    { id: 2, customer: "Sarah Smith", service: "Interior Only", time: "11:45 AM", status: "In Progress" },
    { id: 3, customer: "Michael Johnson", service: "Exterior Only", time: "2:15 PM", status: "Pending" },
    { id: 4, customer: "Emily Wilson", service: "Full Wash", time: "3:30 PM", status: "Scheduled" }
  ];

  // Service Distribution Data for Pie Chart
  const serviceData = [
    { name: "Full Wash", value: 45, color: "#3B82F6" },
    { name: "Exterior Only", value: 30, color: "#10B981" },
    { name: "Interior Only", value: 25, color: "#F59E0B" }
  ];

  // Calculate pie chart segments
  const total = serviceData.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  const getCoordinates = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const getPathData = (percent) => {
    const [startX, startY] = getCoordinates(cumulativePercent);
    cumulativePercent += percent;
    const [endX, endY] = getCoordinates(cumulativePercent);
    const largeArcFlag = percent > 0.5 ? 1 : 0;
    
    return [
      `M ${startX} ${startY}`,
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `L 0 0`
    ].join(' ');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 flex items-start">
            <div className="p-3 rounded-full bg-gray-100 mr-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold my-1">{stat.value}</p>
              <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                <FiTrendingUp className="inline mr-1" /> {stat.change} from yesterday
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Statistical Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Service Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiPieChart className="mr-2" /> Service Distribution
            </h2>
            <button className="text-gray-500 hover:text-gray-700">
              <FiRefreshCw size={16} />
            </button>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4">
              <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90">
                {serviceData.map((item, index) => {
                  const percent = item.value / total;
                  return (
                    <path
                      key={index}
                      d={getPathData(percent)}
                      fill={item.color}
                      stroke="white"
                      strokeWidth="0.01"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">{total} Bookings</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
            </div>
            
            <div className="w-full space-y-2">
              {serviceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round((item.value / total) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiTrendingUp className="mr-2" /> Revenue Trend
            </h2>
            <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-48">
            <div className="flex items-end h-40 space-x-1">
              {[1200, 1900, 1500, 2100, 2800, 3500, 2500].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition" 
                    style={{ height: `${(value / 3500) * 100}%` }}
                  ></div>
                  <span className="text-xs mt-1 text-gray-600">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                  <span className="text-xs font-medium">${value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
            <FiBarChart2 className="mr-2" /> Peak Booking Hours
          </h2>
          <div className="space-y-3">
            {[
              { hour: "8-10 AM", bookings: 15 },
              { hour: "10-12 PM", bookings: 32 },
              { hour: "12-2 PM", bookings: 28 },
              { hour: "2-4 PM", bookings: 20 },
              { hour: "4-6 PM", bookings: 18 }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.hour}</span>
                  <span className="font-medium">{item.bookings} bookings</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(item.bookings / 32) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rest of your dashboard components... */}
      {/* (Recent Bookings, Quick Actions, etc. - same as previous implementation) */}
    </div>
  );
}

export default DashboardAdmin;