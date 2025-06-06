import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiCalendar,
  FiDollarSign,
  FiSettings, 
  FiFileText,
  FiShield,
  FiTruck,
  FiMenu,
  FiX
} from 'react-icons/fi';

function AdminSidebar() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const linkClass = (path) => 
    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
      location.pathname === path || location.pathname.startsWith(path + '/') 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed z-50 bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg md:hidden"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`bg-gray-800 fixed h-full shadow-lg transition-all duration-300 z-40
          ${isMobile ? 'w-64' : 'w-64'}
          ${sidebarOpen ? 'left-0' : '-left-64'}`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6 p-2">
            <h2 className="text-white text-xl md:text-2xl font-bold truncate">
              Car Wash Admin
            </h2>
            {isMobile && (
              <button 
                onClick={toggleSidebar}
                className="text-white hover:text-gray-300"
                aria-label="Close menu"
              >
                <FiX size={20} />
              </button>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              <li>
                <Link 
                  to="/admin/dashboard" 
                  className={linkClass('/dashboard')}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <FiHome className="mr-3 min-w-[20px]" /> 
                  <span className="truncate">Dashboard</span>
                </Link>
              </li>
              
              <li>
                <Link 
                  to="/admin/bookings" 
                  className={linkClass('/bookings')}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <FiCalendar className="mr-3 min-w-[20px]" /> 
                  <span className="truncate">Bookings</span>
                </Link>
              </li>
              
              <li>
                <Link 
                  to="/admin/customers" 
                  className={linkClass('/customers')}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <FiUsers className="mr-3 min-w-[20px]" /> 
                  <span className="truncate">Customers</span>
                </Link>
              </li>
              
              <li>
                <Link 
                  to="/admin/staff" 
                  className={linkClass('/staff')}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <FiShield className="mr-3 min-w-[20px]" /> 
                  <span className="truncate">Staff</span>
                </Link>
              </li>
              
              <li>
                <Link 
                  to="/admin/services" 
                  className={linkClass('/services')}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <FiTruck className="mr-3 min-w-[20px]" /> 
                  <span className="truncate">Services</span>
                </Link>
              </li>
              
              <li>
                <Link 
                  to="/admin/payments" 
                  className={linkClass('/payments')}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <FiDollarSign className="mr-3 min-w-[20px]" /> 
                  <span className="truncate">Payments</span>
                </Link>
              </li>
              
              <li>
                <Link 
                  to="/admin/reports" 
                  className={linkClass('/reports')}
                  onClick={() => isMobile && setSidebarOpen(false)}
                >
                  <FiFileText className="mr-3 min-w-[20px]" /> 
                  <span className="truncate">Reports</span>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="mt-auto pt-2 border-t border-gray-700">
            <Link 
              to="/admin/settings" 
              className={linkClass('/settings')}
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <FiSettings className="mr-3 min-w-[20px]" /> 
              <span className="truncate">Settings</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

export default AdminSidebar;