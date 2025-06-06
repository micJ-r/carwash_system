import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, adminOnly = false, userOnly = false }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg">Loading authentication...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Default to USER if role is missing
  const role = (user?.role || 'USER').toUpperCase();

  if (adminOnly && role !== 'ADMIN') {
    return <Navigate to="/" replace />; // Redirect to home instead of unauthorized
  }

  if (userOnly && role !== 'USER') {
    return <Navigate to="/" replace />; // Redirect to home instead of unauthorized
  }

  return children;
}

export default ProtectedRoute;