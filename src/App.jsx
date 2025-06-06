import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

import Home from './pages/user/Home';
import Dashboard from './pages/user/Dashboard';
import Profile from './pages/user/Profile';
import Booking from './pages/user/Booking';
import History from './pages/user/History';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Customers from './pages/admin/Customers';
import DashboardAdmin from './pages/admin/Dashboard';
import Employees from './pages/admin/Employees';
import Reports from './pages/admin/Reports';

import ProtectedRoute from './components/ProtectedRoute';
import StaffManagement from './pages/admin/StaffManagement';
import Payments from './pages/admin/Payments';
import SystemSettings from './pages/admin/SystemSettings';
import Bookings from './pages/admin/Bookings';
import WashService from './pages/admin/Service';
import MyProfile from './pages/admin/MyProfile';
import Account from './pages/admin/Account';
import PublicLayout from './layouts/PublicLayout';
import LandingPage from './pages/auth/LandingPage';
import AccountSetting from './pages/user/AccountSetting';
import Service from './pages/user/Service';
import Contact from './pages/user/Contact';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<PublicLayout/>}>
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          </Route>

            {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardAdmin />} />
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="customers" element={<Customers />} />
            <Route path="employees" element={<Employees />} />
            <Route path="reports" element={<Reports />} />
            <Route path="services" element={<WashService />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="payments" element={<Payments />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="account" element={<Account />} />

          </Route>

          {/* User routes */}
          <Route path="/user" element={
            <ProtectedRoute userOnly={true}> 
              <UserLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="booking" element={<Booking />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<AccountSetting />} />
            <Route path="services" element={<Service />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
