import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const redirectBasedOnRole = useCallback((userData) => {
    if (!userData) {
      navigate('/login');
      return;
    }

    const role = userData.role?.toUpperCase() || 'USER';
    const currentPath = window.location.pathname;

    // Prevent infinite redirects by checking current path
    if (role === 'ADMIN' && !currentPath.startsWith('/admin')) {
      navigate('/admin/dashboard', { replace: true });
    } else if (role === 'USER' && !currentPath.startsWith('/booking')) {
      navigate('/user/booking', { replace: true }); // Changed to /booking as per requirement
    }
  }, [navigate]);

  const verifySession = useCallback(async () => {
    try {
      const res = await axios.get('/auth/verify', { withCredentials: true });
      const userData = res.data.user;
      setUser(userData);
      setAuthError(null);
      return userData;
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Session expired');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      // Skip session verification if user is already authenticated
      if (!user) {
        const userData = await verifySession();
        redirectBasedOnRole(userData);
      } else {
        setLoading(false); // Set loading to false if user is already set
      }
    };
    checkAuth();
  }, [verifySession, redirectBasedOnRole, user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', { email, password }, {
        withCredentials: true,
      });
      const userData = res.data; // Expecting { role, id, email, username }
      setUser(userData);
      setAuthError(null);
      redirectBasedOnRole(userData); // Call redirect immediately after setting user
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/register', userData, {
        withCredentials: true,
      });
      const newUser = res.data;
      setUser(newUser);
      redirectBasedOnRole(newUser);
      setAuthError(null);
      return { success: true, data: newUser };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
      setAuthError(null);
      navigate('/login');
    }
  };

  const refreshToken = async () => {
    try {
      await axios.post('/auth/refresh', {}, { withCredentials: true });
      return await verifySession();
    } catch (err) {
      console.error('Token refresh failed:', err);
      await logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        register,
        logout,
        refreshToken,
        isAuthenticated: !!user,
        verifySession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);