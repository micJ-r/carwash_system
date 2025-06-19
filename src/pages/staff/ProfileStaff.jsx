import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserEdit, FaExclamationCircle } from 'react-icons/fa';
import FormInput from '../../components/common/FormInput';

function ProfileStaff() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordErrors({ ...passwordErrors, [e.target.name]: '' });
  };

  const validateProfileForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords must match';
    }
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;
    setLoading(true);
    try {
      console.log('Updating profile for user ID:', user.id);
      const updateData = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        role: 'STAFF',
      };
      const response = await axios.put(`/auth/users/${user.id}`, updateData, {
        withCredentials: true,
      });
      console.log('Profile update response:', response.data);
      login(response.data);
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (errorData.error) {
          toast.error(errorData.error);
          setErrors({ general: errorData.error });
        } else {
          setErrors(errorData.details || errorData || {});
          toast.error('Please correct the errors');
        }
      } else if (err.response?.status === 401) {
        toast.error('Session expired, please log in again');
        setErrors({ general: 'Unauthorized' });
      } else if (err.response?.status === 403) {
        toast.error('Access denied');
        setErrors({ general: 'Unauthorized access' });
      } else {
        toast.error('Failed to update profile');
        setErrors({ general: 'Failed to update profile' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;
    setPasswordLoading(true);
    try {
      console.log('Updating password for user ID:', user.id);
      const updateData = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };
      await axios.patch(`/auth/users/${user.id}/password`, updateData, {
        withCredentials: true,
      });
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Error updating password:', err);
      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (errorData.error) {
          toast.error(errorData.error);
          setPasswordErrors({ general: errorData.error });
        } else {
          setPasswordErrors(errorData.details || errorData || {});
          toast.error('Please correct the errors');
        }
      } else if (err.response?.status === 401) {
        toast.error('Invalid current password or session expired');
        setPasswordErrors({ general: 'Invalid current password' });
      } else if (err.response?.status === 403) {
        toast.error('Access denied');
        setPasswordErrors({ general: 'Unauthorized access' });
      } else {
        toast.error('Failed to update password');
        setPasswordErrors({ general: 'Failed to update password' });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FaUserEdit className="mr-2 text-blue-600" />
          Staff Profile
        </h2>
        {errors.general && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
            <FaExclamationCircle className="mr-2" />
            {errors.general}
          </div>
        )}
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <FormInput
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
            icon={<FaUser />}
            error={errors.username}
            disabled={!editMode}
            className="w-full px-4 py-2 border rounded-md"
            aria-label="Username input"
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            icon={<FaEnvelope />}
            error={errors.email}
            disabled={!editMode}
            className="w-full px-4 py-2 border rounded-md"
            aria-label="Email input"
          />
          <FormInput
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
            icon={<FaPhone />}
            error={errors.phone}
            disabled={!editMode}
            className="w-full px-4 py-2 border rounded-md"
            aria-label="Phone number input"
          />
          <div className="flex justify-between">
            {editMode ? (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label="Save profile"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      username: user?.username || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                    });
                    setErrors({});
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                  aria-label="Cancel edit"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                aria-label="Edit profile"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>

        <hr className="my-6 border-gray-200" />

        <h3 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h3>
        {passwordErrors.general && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
            <FaExclamationCircle className="mr-2" />
            {passwordErrors.general}
          </div>
        )}
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <FormInput
            label="Current Password"
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Enter current password"
            required
            icon={<FaLock />}
            error={passwordErrors.currentPassword}
            className="w-full px-4 py-2 border rounded-md"
            aria-label="Current password input"
          />
          <FormInput
            label="New Password"
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
            required
            icon={<FaLock />}
            error={passwordErrors.newPassword}
            className="w-full px-4 py-2 border rounded-md"
            aria-label="New password input"
          />
          <FormInput
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm new password"
            required
            icon={<FaLock />}
            error={passwordErrors.confirmPassword}
            className="w-full px-4 py-2 border rounded-md"
            aria-label="Confirm new password input"
          />
          <button
            type="submit"
            disabled={passwordLoading}
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ${passwordLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Change password"
          >
            {passwordLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
                Saving...
              </span>
            ) : (
              'Change Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileStaff;