import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

function StaffManagement() {
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Cleaner', active: true },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Receptionist', active: false },
    { id: 3, name: 'Carol Lee', email: 'carol@example.com', role: 'Washer', active: true },
  ]);

  const deleteStaff = (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      const updated = staffList.filter((staff) => staff.id !== id);
      setStaffList(updated);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          <FiPlus className="mr-2" />
          Add Staff
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
            {staffList.map((staff) => (
              <tr key={staff.id}>
                <td className="px-6 py-4">{staff.name}</td>
                <td className="px-6 py-4">{staff.email}</td>
                <td className="px-6 py-4">{staff.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    staff.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {staff.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 flex space-x-4">
                  <button className="text-blue-600 hover:underline text-sm flex items-center">
                    <FiEdit2 className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => deleteStaff(staff.id)}
                    className="text-red-600 hover:underline text-sm flex items-center"
                  >
                    <FiTrash2 className="mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {staffList.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No staff members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffManagement;
