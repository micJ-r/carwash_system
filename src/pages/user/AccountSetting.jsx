import React, { useState } from 'react';
import { FiLock, FiBell, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function AccountSetting() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle password input changes
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Handle notification toggle
  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  // Validate password form
  const validatePasswordForm = () => {
    if (!passwordData.currentPassword) return 'Current password is required';
    if (!passwordData.newPassword) return 'New password is required';
    if (passwordData.newPassword !== passwordData.confirmPassword) return 'Passwords do not match';
    if (passwordData.newPassword.length < 8) return 'New password must be at least 8 characters';
    return null;
  };

  // Handle password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validatePasswordForm();
    if (errorMsg) {
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    try {
      setLoading(true);
      setError('');
      await axios.patch(
        '/users/me/password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { withCredentials: true }
      );
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update password';
      setError(errorMsg);
      toast.error(errorMsg);
      if (err.response?.status === 401) {
        await logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle notification update
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await axios.patch('/users/me/notifications', notifications, { withCredentials: true });
      toast.success('Notification settings updated successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update notification settings';
      setError(errorMsg);
      toast.error(errorMsg);
      if (err.response?.status === 401) {
        await logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-md rounded-lg max-w-lg w-full p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center">
          <FiLock className="mr-2" /> Account Settings
        </h2>
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <FiAlertCircle className="mr-2" /> {error}
          </div>
        )}
        {/* Password Change Form */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                name="currentPassword"
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Current password"
                aria-label="Current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                name="newPassword"
                type="password"
                required
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="New password"
                aria-label="New password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
                aria-label="Confirm new password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Update password"
            >
              Update Password
            </button>
          </form>
        </div>
        {/* Notification Settings Form */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h3>
          <form onSubmit={handleNotificationSubmit} className="space-y-5">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={notifications.emailNotifications}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                aria-label="Email notifications"
              />
              <label className="ml-2 text-sm text-gray-700">Receive email notifications</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="smsNotifications"
                checked={notifications.smsNotifications}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                aria-label="SMS notifications"
              />
              <label className="ml-2 text-sm text-gray-700">Receive SMS notifications</label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Update notification settings"
            >
              Save Preferences
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AccountSetting;