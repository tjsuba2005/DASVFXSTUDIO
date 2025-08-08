// src/context/AuthProvider.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Get the backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_API_URL;

// 1. Create the context
const AuthContext = createContext();

// 2. Create a custom hook for easy consumption
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Create the Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading until session is checked

  // This effect runs once on app load to check for an existing session cookie
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/status`, {
          withCredentials: true, // Crucial for sending the session cookie
        });
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
        }
      } catch (error) {
        // This is expected if the user is not logged in
        console.error('User is not authenticated on load');
        setUser(null);
      } finally {
        // We are done checking, so allow the app to render
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []); // Empty array means this effect runs only once

  // CRITICAL FIX: The function is now named `login` to match the context value.
  const login = () => {
    // This is the correct way to initiate an OAuth flow.
    // It navigates the entire browser to the backend endpoint.
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const logout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, { withCredentials: true });
      setUser(null); // Clear the user from frontend state
      // Optionally, navigate to the homepage after logout
      // window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // The value object provides state and functions to consuming components
  const value = {
    user,
    isLoading,
    login, // Now this correctly references the `login` function above
    logout,
  };

  // Prevent rendering the main app until the initial auth check is complete
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};