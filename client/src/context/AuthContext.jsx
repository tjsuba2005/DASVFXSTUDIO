import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const BACKEND_URL =  import.meta.env.VITE_API_URL;

// 1. Create the context
const AuthContext = createContext();

// 2. Create a custom hook to make using the context easier
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Create the Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This runs once when the app loads to check for an existing session
    const checkLoggedIn = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/status`, {
          withCredentials: true,
        });
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('User is not authenticated', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/auth/google`);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Failed to initiate login', error);
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/auth/logout`, { withCredentials: true });
      setUser(null); // Clear the user state on the frontend
      // You might want to navigate the user to the homepage here
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // The value that will be available to all children components
  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  // We don't render anything until we've checked the auth status
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};