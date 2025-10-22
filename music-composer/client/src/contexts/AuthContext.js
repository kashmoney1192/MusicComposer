import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set auth header for all requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check for existing auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          setToken(savedToken);
          const response = await axios.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      toast.success('Welcome back!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/auth/register', { name, email, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.info('You have been logged out');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/auth/profile', profileData);
      setUser(response.data.user);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const loginWithGoogle = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  const handleGoogleCallback = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      setToken(token);
      // Fetch user data
      axios.get('/auth/me')
        .then(response => {
          setUser(response.data.user);
          toast.success('Successfully logged in with Google!');
        })
        .catch(error => {
          console.error('Failed to fetch user after Google login:', error);
          logout();
        });
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('/auth/refresh');
      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  // Auto-refresh token before expiry
  useEffect(() => {
    if (token) {
      const refreshInterval = setInterval(() => {
        refreshToken();
      }, 6 * 60 * 60 * 1000); // Refresh every 6 hours

      return () => clearInterval(refreshInterval);
    }
  }, [token]);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    loginWithGoogle,
    handleGoogleCallback,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}