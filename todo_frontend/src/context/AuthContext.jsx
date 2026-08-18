import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const accessToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (!accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      const userData = await authService.getCurrentUser();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.warn('Authentication token invalid or expired:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleLogoutEvent = () => {
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => window.removeEventListener('auth:logout', handleLogoutEvent);
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    
    // Fetch user details
    const userData = await authService.getCurrentUser();
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const register = async (username, password, email) => {
    const data = await authService.register(username, password, email);
    if (data.tokens) {
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
    }
    if (data.user) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const quickDemoLogin = async () => {
    return await login('demo', 'password123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
