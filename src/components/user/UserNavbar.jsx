import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiUser, FiLogOut, FiCalendar, FiHome, FiSettings, FiPhone, FiMenu, FiX,
} from 'react-icons/fi';
import { FaCarAlt } from 'react-icons/fa';

function UserNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLink = (to, label, Icon) => (
    <Link
      to={to}
      onClick={() => setMobileMenuOpen(false)}
      className="flex items-center px-4 py-2 text-sm text-white hover:bg-blue-700 rounded-md transition"
    >
      <Icon className="mr-2" /> {label}
    </Link>
  );

  return (
    <nav className="bg-blue-700 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link to="/user" className="flex items-center text-white text-xl font-bold">
            <FaCarAlt className="mr-2 text-white text-2xl" />
            SparkleWash
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {navLink('/user', 'Home', FiHome)}
            {navLink('/user/services', 'Services', FaCarAlt)}
            {isAuthenticated && navLink('/user/booking', 'My Bookings', FiCalendar)}
            {navLink('/user/contact', 'Contact', FiPhone)}
          </div>

          {/* Profile / Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center bg-blue-800 px-4 py-2 rounded-md text-white hover:bg-blue-900 transition"
                >
                  <div className="h-8 w-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="ml-2">{user?.username}</span>
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <FiUser className="mr-2" /> Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <FiSettings className="mr-2" /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 flex items-center"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-blue-800 px-4 py-2 rounded transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition shadow"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-600 px-4 pt-4 pb-6 space-y-2">
          {navLink('/user', 'Home', FiHome)}
          {navLink('/user/services', 'Services', FaCarAlt)}
          {isAuthenticated && navLink('/user/booking', 'My Bookings', FiCalendar)}
          {navLink('/user/contact', 'Contact', FiPhone)}

          <hr className="border-blue-400 my-2" />

          {isAuthenticated ? (
            <>
              {navLink('/profile', 'Profile', FiUser)}
              {navLink('/settings', 'Settings', FiSettings)}
              <button
                onClick={handleLogout}
                className="flex items-center text-white hover:bg-blue-800 px-4 py-2 rounded-md w-full text-left"
              >
                <FiLogOut className="mr-2" /> Logout
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                className="block text-center bg-white text-blue-600 px-4 py-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block text-center bg-blue-900 text-white px-4 py-2 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default UserNavbar;
