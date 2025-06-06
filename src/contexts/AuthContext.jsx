// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await axios.get('/auth/verify', { withCredentials: true });
        const userFromBackend = res.data.user; // assume backend returns full user data
        setUser(userFromBackend);
        redirectBasedOnRole(userFromBackend);
      } catch (err) {
        console.warn('No active session');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const redirectBasedOnRole = (user) => {
  const path = window.location.pathname;
  if (user.role === 'ADMIN' && !path.startsWith('/admin')) {
    navigate('/admin/dashboard');
  } else if (user.role !== 'ADMIN' && !path.startsWith('/user')) {
    navigate('/user/dashboard');
  }
};


  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password }, {
        withCredentials: true,
      });

      const userData = response.data;
      setUser(userData);
      redirectBasedOnRole(userData);
      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData, {
        withCredentials: true,
      });

      const newUser = response.data;
      setUser(newUser);
      redirectBasedOnRole(newUser);
      return { success: true, data: newUser };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
