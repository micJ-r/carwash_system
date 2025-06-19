import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { setRefreshTokenFunction } from '../api/axios';

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
    if (role === 'ADMIN' && !currentPath.startsWith('/admin')) {
      navigate('/admin/dashboard', { replace: true });
    } else if (role === 'STAFF' && !currentPath.startsWith('/staff')) {
      navigate('/staff/dashboard', { replace: true });
    } else if (role === 'USER' && !currentPath.startsWith('/user')) {
      navigate('/user/dashboard', { replace: true });
    }
  }, [navigate]);

  const verifySession = useCallback(async () => {
    try {
      console.log('Verifying session...');
      const res = await axios.get('/auth/verify');
      const userData = res.data.user;
      console.log('Verify session response:', userData);
      setUser(userData);
      setAuthError(null);
      localStorage.setItem('authToken', 'true');
      return userData;
    } catch (err) {
      console.error('Verify session error:', err.response?.data || err.message);
      setAuthError(err.response?.data?.error || 'Session expired');
      setUser(null);
      localStorage.removeItem('authToken');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      console.log('Refreshing token...');
      await axios.post('/auth/refresh');
      console.log('Token refreshed');
      const userData = await verifySession();
      return userData;
    } catch (err) {
      console.error('Token refresh failed:', err.response?.data || err.message);
      await logout();
      return null;
    }
  }, [verifySession]);

  useEffect(() => {
    const checkAuth = async () => {
      const hasToken = localStorage.getItem('authToken');
      const currentPath = window.location.pathname;
      if (hasToken && !['/login', '/register'].includes(currentPath)) {
        console.log('Checking auth with authToken present');
        const userData = await verifySession();
        redirectBasedOnRole(userData);
      } else {
        console.log('No authToken or on public route, skipping verification');
        setLoading(false);
        if (!user && !['/login', '/register'].includes(currentPath)) {
          navigate('/login');
        }
      }
    };
    checkAuth();
  }, [verifySession, redirectBasedOnRole, user, navigate]);

  useEffect(() => {
    setRefreshTokenFunction(refreshToken);
  }, [refreshToken]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log('Login called with:', { email, password: '[REDACTED]' });
      if (!email?.trim() || !password?.trim()) {
        const errorMsg = 'Email and password are required';
        console.error('Login validation failed:', errorMsg);
        setAuthError(errorMsg);
        return { success: false, error: errorMsg };
      }
      const res = await axios.post('/auth/login', { email: email.trim(), password: password.trim() });
      console.log('Login response:', res.data);
      localStorage.setItem('authToken', 'true');
      const userData = res.data.user; // Adjusted to match backend response
      setUser(userData);
      setAuthError(null);
      redirectBasedOnRole(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      console.error('Login error:', err.response?.data || err.message);
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/register', userData);
      console.log('Register response:', res.data);
      localStorage.setItem('authToken', 'true');
      const newUser = res.data.user; // Adjusted to match backend response
      setUser(newUser);
      redirectBasedOnRole(newUser);
      setAuthError(null);
      return { success: true, data: newUser };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      console.error('Register error:', err.response?.data || err.message);
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      console.log('Logout successful');
    } catch (err) {
      console.error('Logout failed:', err.response?.data || err.message);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      setAuthError(null);
      navigate('/login');
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