import React from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';

function Employees() {
  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          <FiPlus className="mr-2" />
          Add Staff
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full max-w-md focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search staff by name, role..."
            className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Employees Table */}
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
            {/* Sample Row */}
            <tr>
              <td className="px-6 py-4">Jane Smith</td>
              <td className="px-6 py-4">jane@example.com</td>
              <td className="px-6 py-4">Cleaner</td>
              <td className="px-6 py-4">
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                  Active
                </span>
              </td>
              <td className="px-6 py-4">
                <button className="text-blue-600 hover:underline text-sm mr-4">Edit</button>
                <button className="text-red-600 hover:underline text-sm">Remove</button>
              </td>
            </tr>
            {/* Add more rows dynamically */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employees;
