import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function AdminLayout() {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
    } catch (err) {
      toast.error('Failed to logout');
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex">
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} handleLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-h-screen bg-gray-100 md:ml-64">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 md:ml-64">
          <AdminNavbar toggleSidebar={toggleSidebar} />
        </div>

        {/* Main content area with top padding equal to header height */}
        <main className="flex-1 pt-16 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;