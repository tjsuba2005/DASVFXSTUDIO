import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Use a single, consistent environment variable for the backend URL
const BACKEND_URL = import.meta.env.API_BASE_URL;

// 1. Create the context
const AuthContext = createContext();

// 2. Create a custom hook for easy consumption by any component
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Create the Provider component which will house all auth logic
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading until session is checked

  // This effect runs once on app load to check for an existing session cookie
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Use the defined BACKEND_URL
        const response = await axios.get(`${BACKEND_URL}/api/auth/status`, {
          withCredentials: true, // Crucial for sending the session cookie
        });

        if (response.data.isAuthenticated) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        // This is expected if the user is not logged in or the server is down
        console.log('Auth check failed, user is not authenticated.');
        setUser(null);
      } finally {
        // We are done checking, so allow the rest of the app to render
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []); // Empty array means this effect runs only once on mount

  // --- Auth Actions ---
 console.log("The API URL is:", BACKEND_URL); 
  // Function to initiate the Google OAuth flow
  const login = () => {
    // This correctly navigates the entire browser window to the backend
    // which then redirects to Google.
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  // Function to log the user out
  const logout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
        withCredentials: true,
      });
      setUser(null); // Clear the user from frontend state immediately
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the server call fails, we can log the user out on the frontend
      setUser(null);
    }
  };

  // The value object provides state and functions to all consuming components
  const value = {
    user,         // The user object or null
    isLoading,    // boolean: true while checking auth status, then false
    isAuthenticated: !!user, // A convenient boolean flag
    login,        // function to trigger login
    logout,       // function to trigger logout
  };

  // The `!isLoading && children` pattern is a great UX feature. It prevents
  // the app from showing a "logged out" state for a split second before
  // the auth check completes.
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};