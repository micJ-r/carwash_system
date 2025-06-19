import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FaUserEdit, FaTrash, FaPlus } from 'react-icons/fa';

function StaffManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(null);
  const [newStaff, setNewStaff] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [editStaff, setEditStaff] = useState({
    id: null,
    username: '',
    email: '',
    phone: '',
    role: 'STAFF',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/auth/users', { withCredentials: true });
        const staffUsers = response.data.filter(user => user.role === 'STAFF');
        setUsers(staffUsers);
      } catch (err) {
        toast.error('Failed to load staff users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (newStaff.password !== newStaff.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('/auth/register', { ...newStaff, role: 'STAFF' }, { withCredentials: true });
      setUsers([...users, response.data]);
      setNewStaff({ username: '', email: '', phone: '', password: '', confirmPassword: '' });
      setShowAddForm(false);
      toast.success('Staff added successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add staff');
    }
  };

  const handleEditStaff = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/auth/users/${editStaff.id}`, editStaff, { withCredentials: true });
      setUsers(users.map(user => user.id === editStaff.id ? response.data : user));
      setShowEditForm(null);
      toast.success('Staff details updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update staff');
    }
  };

  const handleDeleteStaff = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await axios.delete(`/auth/users/${userId}`, { withCredentials: true });
      setUsers(users.filter(user => user.id !== userId));
      toast.success('Staff deleted successfully');
    } catch (err) {
      toast.error('Failed to delete staff');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/auth/users/${userId}`, { role: newRole }, { withCredentials: true });
      if (newRole !== 'STAFF') {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
      }
      toast.success('Role updated successfully');
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const openEditForm = (user) => {
    setEditStaff({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
    });
    setShowEditForm(user.id);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaUserEdit className="mr-2 text-blue-600" /> Manage Staff
      </h2>

      {/* Add Staff Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
      >
        <FaPlus className="mr-2" /> {showAddForm ? 'Cancel' : 'Add New Staff'}
      </button>

      {/* Add Staff Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <form onSubmit={handleAddStaff}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Username"
                value={newStaff.username}
                onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                className="p-2 border rounded-md"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                className="p-2 border rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                className="p-2 border rounded-md"
              />
              <input
                type="password"
                placeholder="Password"
                value={newStaff.password}
                onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                className="p-2 border rounded-md"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={newStaff.confirmPassword}
                onChange={(e) => setNewStaff({ ...newStaff, confirmPassword: e.target.value })}
                className="p-2 border rounded-md"
                required
              />
            </div>
            <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Add Staff
            </button>
          </form>
        </div>
      )}

      {/* Staff Table */}
      {loading ? (
        <div className="flex justify-center">
          <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600">No staff users found.</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Username</th>
                <th className="py-2">Email</th>
                <th className="py-2">Phone</th>
                <th className="py-2">Role</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="py-2">{user.username}</td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">{user.phone || '-'}</td>
                  <td className="py-2">{user.role}</td>
                  <td className="py-2 flex gap-2">
                    <button
                      onClick={() => openEditForm(user)}
                      className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      aria-label={`Edit ${user.username}`}
                    >
                      <FaUserEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(user.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      aria-label={`Delete ${user.username}`}
                    >
                      <FaTrash />
                    </button>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-2 py-1 border rounded-md"
                      aria-label={`Change role for ${user.username}`}
                    >
                      <option value="USER">User</option>
                      <option value="STAFF">Staff</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Staff</h3>
            <form onSubmit={handleEditStaff}>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={editStaff.username}
                  onChange={(e) => setEditStaff({ ...editStaff, username: e.target.value })}
                  className="p-2 border rounded-md"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editStaff.email}
                  onChange={(e) => setEditStaff({ ...editStaff, email: e.target.value })}
                  className="p-2 border rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={editStaff.phone}
                  onChange={(e) => setEditStaff({ ...editStaff, phone: e.target.value })}
                  className="p-2 border rounded-md"
                />
                <select
                  value={editStaff.role}
                  onChange={(e) => setEditStaff({ ...editStaff, role: e.target.value })}
                  className="p-2 border rounded-md"
                >
                  <option value="USER">User</option>
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffManagement;