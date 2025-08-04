import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

// This custom hook will manage the logic for checking auth status
export const useAuthStatus = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We wrap the async function inside the useEffect
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/status`, {
          withCredentials: true,
        });

        if (response.data.isAuthenticated) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth status check failed:", err);
        // In case of a network error, we assume the user is not logged in
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []); // The empty dependency array means this only runs once


   const logout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
        withCredentials: true,
      });
      // After successful logout on the server, update the local state
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  // The hook returns the state values for the component to use
  return { user, isLoading, logout  };
};