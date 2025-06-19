import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiUser, FiLogOut, FiCalendar, FiHome, FiSettings, FiPhone, FiMenu, FiX, FiSearch,
} from 'react-icons/fi';
import { FaCarAlt, FaCar } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

function UserNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const role = isAuthenticated ? user?.role || 'user' : 'public';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = {
    user: [
      { to: '/user', label: 'Home', icon: FiHome },
      { to: '/user/services', label: 'Services', icon: FaCar },
      { to: '/user/booking', label: 'My Bookings', icon: FiCalendar },
      { to: '/user/contact', label: 'Contact', icon: FiPhone },
    ],
    public: [
      { to: '/', label: 'Home', icon: FiHome },
      { to: '/services', label: 'Services', icon: FaCar },
      { to: '/about', label: 'About', icon: FiUser },
    ],
  };

  const links = navLinks[role] || [];

  return (
    <nav className="bg-amber-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center h-16 gap-4">
          {/* Brand (moved to left, order-1) */}
          <Link
            to={role === 'user' ? '/user' : '/'}
            className="order-1 text-white text-xl font-bold flex items-center whitespace-nowrap"
          >
            <FaCarAlt className="mr-2 text-white text-2xl" />
            SparkleWash
          </Link>

          {/* Search Box (moved to center, order-2 and flex-grow) */}
          {role === 'public' && (
            <form className="flex-1 flex md:max-w-md w-full relative order-2 mx-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-4 pr-10 py-2 rounded-full bg-white text-sm text-gray-800 placeholder-gray-500 focus:outline-none shadow"
              />
              <FiSearch className="absolute right-3 top-2.5 text-yellow-600" />
            </form>
          )}

          {/* Desktop Nav (moved to right, order-3) */}
          <div className="hidden md:flex items-center space-x-4 order-3">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md transition ${
                    isActive ? 'bg-yellow-600 text-white' : 'text-white hover:bg-yellow-600'
                  }`
                }
              >
                <Icon className="mr-2" /> {label}
              </NavLink>
            ))}

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center bg-yellow-600 px-4 py-2 rounded-md text-white hover:bg-yellow-700 transition"
              >
                <FiUser className="mr-2" /> Account
              </button>
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-xl z-50">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/user/profile"
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/user/settings"
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden order-4">
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
        <div className="md:hidden bg-yellow-500 px-4 pt-4 pb-6 space-y-2">
          {role === 'public' && (
            <form className="flex px-2">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-4 py-2 rounded-full text-sm text-gray-800"
              />
            </form>
          )}
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-white hover:bg-yellow-600 rounded-md transition"
            >
              <Icon className="mr-2" /> {label}
            </Link>
          ))}
          <hr className="border-yellow-300 my-2" />
          {isAuthenticated ? (
            <>
              <Link
                to="/user/profile"
                className="block px-4 py-2 text-sm text-white hover:bg-yellow-600 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/user/settings"
                className="block px-4 py-2 text-sm text-white hover:bg-yellow-600 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-yellow-600 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 text-sm text-white hover:bg-yellow-600 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-sm text-white hover:bg-yellow-600 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default UserNavbar;
