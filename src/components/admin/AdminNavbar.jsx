import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { MdLogout, MdNotificationsNone } from "react-icons/md";
import { HiOutlineMenu } from "react-icons/hi";
import { FiSearch, FiCalendar } from "react-icons/fi";

const AdminNavbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mock notifications data
  const notifications = [
    { id: 1, message: "New booking from John Doe", time: "2 mins ago" },
    { id: 2, message: "Payment received for booking #10716", time: "15 mins ago" },
    { id: 3, message: "System maintenance scheduled", time: "1 hour ago" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="w-full px-4 py-3 flex justify-between items-center">
        {/* Left: Logo, Menu (mobile), and Search */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="text-2xl text-gray-600 md:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            <HiOutlineMenu />
          </button>

          <Link to="/admin/dashboard" className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <span className="hidden sm:inline">SparkleWash Admin</span>
            <span className="sm:hidden">SparkleWash</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center ml-6 bg-gray-100 rounded-full px-4 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search bookings, customers..."
              className="bg-transparent border-none outline-none w-64 text-gray-700 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Right: Notifications, Search Toggle, Account Dropdown */}
        <div className="flex items-center gap-4">
          {/* New Booking Button */}
          <button className="hidden md:flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 text-sm">
            <FiCalendar /> <span className="hidden lg:inline">New Booking</span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-1 text-gray-600 hover:text-blue-600 relative"
              aria-label="Toggle notifications"
            >
              <MdNotificationsNone className="text-2xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </span>
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border rounded-md shadow-lg z-50">
                <div className="p-2 border-b">
                  <h4 className="font-medium">Notifications</h4>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(({ id, message, time }) => (
                    <div key={id} className="p-3 border-b hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm">{message}</p>
                      <p className="text-xs text-gray-500 mt-1">{time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center text-sm text-blue-600 hover:bg-gray-50 cursor-pointer">
                  View All
                </div>
              </div>
            )}
          </div>

          {/* Mobile Search Icon */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden text-xl text-gray-600"
            aria-label="Toggle search"
          >
            <FiSearch />
          </button>

          {/* Account Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <FaUserCircle className="text-2xl text-gray-700" />
              <span className="text-gray-700 hidden sm:inline">Admin</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                <Link
                  to="/admin/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/admin/account"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 w-full text-left text-sm text-red-600 hover:bg-gray-100"
                >
                  <MdLogout /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="px-4 pb-3 md:hidden">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search bookings, customers..."
              className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-500"
              autoFocus
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;