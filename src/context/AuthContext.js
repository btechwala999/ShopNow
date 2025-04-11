import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext();

// Add a localStorage key for users
const USERS_STORAGE_KEY = 'ecommerce_users';
const USER_DATA_KEY = 'ecommerce_user_data';
const MIN_LOADING_TIME = 2000; // 2 seconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem(USER_DATA_KEY)) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load users from localStorage or initialize with demo user
  const initializeUsers = () => {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!savedUsers) {
      const initialUsers = [
        { username: 'johnd', email: 'john@example.com', password: 'm38rmF$' }
      ];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(savedUsers);
  };

  // Keep users data in state
  const [users, setUsers] = useState(initializeUsers);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_DATA_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // Helper function to ensure minimum loading time
  const ensureMinLoadingTime = async (callback) => {
    const startTime = Date.now();
    setLoading(true);
    
    try {
      const result = await callback();
      
      // Calculate how much time has passed
      const elapsedTime = Date.now() - startTime;
      
      // If less than minimum time, wait the remaining time
      if (elapsedTime < MIN_LOADING_TIME) {
        await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime));
      }
      
      setLoading(false);
      return result;
    } catch (err) {
      // Still ensure minimum loading time on error
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < MIN_LOADING_TIME) {
        await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsedTime));
      }
      
      setLoading(false);
      throw err;
    }
  };

  const register = async (username, email, password) => {
    setError(null);
    
    return ensureMinLoadingTime(async () => {
      try {
        // Check if username already exists
        if (users.some(user => user.username === username)) {
          setError('Username already exists');
          return false;
        }
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
          setError('Email already in use');
          return false;
        }
        
        // Add new user to users array
        const newUser = { username, email, password };
        setUsers([...users, newUser]);
        
        return true;
      } catch (err) {
        setError('Registration failed');
        return false;
      }
    });
  };

  const login = async (username, password) => {
    setError(null);
    
    return ensureMinLoadingTime(async () => {
      try {
        // For demo user, use the API
        if (username === 'johnd' && password === 'm38rmF$') {
          const data = await apiLogin(username, password);
          setToken(data.token);
          setUser({ username, email: 'john@example.com' });
          return true;
        }
        
        // For registered users, check local storage
        const foundUser = users.find(
          user => user.username === username && user.password === password
        );
        
        if (foundUser) {
          // Generate a fake token
          const fakeToken = 'local_' + Math.random().toString(36).substring(2);
          setToken(fakeToken);
          setUser({ username: foundUser.username, email: foundUser.email });
          return true;
        }
        
        setError('Invalid username or password');
        return false;
      } catch (err) {
        setError('Login failed');
        return false;
      }
    });
  };

  const logout = async () => {
    return ensureMinLoadingTime(async () => {
      setUser(null);
      setToken(null);
      return true;
    });
  };

  const isAuthenticated = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        logout,
        register,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 