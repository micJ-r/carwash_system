import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import StaffLayout from './layouts/StaffLayout';
import LandingPage from './pages/auth/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardAdmin from './pages/admin/Dashboard';
import BookingsAdmin from './pages/admin/Bookings';
import StaffManagement from './pages/admin/StaffManagement';
import Payments from './pages/admin/Payments';
import Reports from './pages/admin/Reports';
import SystemSettings from './pages/admin/SystemSettings';
import MyProfile from './pages/admin/MyProfile';
import Account from './pages/admin/Account';
import Home from './pages/user/Home';
import DashboardUser from './pages/user/DashboardUser';
import Profile from './pages/user/UserProfile';
import Booking from './pages/user/UserBookings';
import History from './pages/user/History';
import AccountSetting from './pages/user/AccountSetting';
import Service from './pages/user/Service';
import Payment from './pages/user/Payment';
import Contact from './pages/user/Contact';
import DashboardStaff from './pages/staff/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WashService from './pages/admin/Service';
import ProtectedRoute from './components/ProtectedRoute';
import SalesReport from './pages/admin/SalesReport';
import BookingsStaff from './pages/staff/BookingsStaff';
import ProfileStaff from './pages/staff/ProfileStaff';
import UserManagement from './pages/admin/Customers';
import UserProfile from './pages/user/UserProfile';
import About from './pages/auth/About';
import ServicePage from './pages/auth/ServicePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<ServicePage />} />


          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardAdmin />} />
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="bookings" element={<BookingsAdmin />} />
            <Route path="services" element={<WashService />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="account" element={<Account />} />
            <Route path="sales" element={<SalesReport />} />
            <Route path="customers" element={<UserManagement />} />

          </Route>
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="dashboard" element={<DashboardUser />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="booking" element={<Booking />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<AccountSetting />} />
            <Route path="services" element={<Service />} />
            <Route path="payment" element={<Payment />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          <Route
            path="/staff"
            element={
              <ProtectedRoute staffOnly={true}>
                <StaffLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardStaff />} />
            <Route path="dashboard" element={<DashboardStaff />} />
            <Route path="bookings" element={<BookingsStaff />} />
            <Route path="profile" element={<ProfileStaff />} />

          </Route>
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
}

export default App;