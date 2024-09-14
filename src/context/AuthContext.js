import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';  // To decode JWT
import { toast, ToastContainer } from 'react-toastify';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // User state
  const [token, setToken] = useState(localStorage.getItem('token'));  // Token stored in localStorage

  // Set axios default headers and decode token when token changes 
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const decodedToken = jwtDecode(token);  // Decode the token
      setUser({ id: decodedToken.userId, email: decodedToken.email });  // Set user info in state
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Function to check if the token is expired
  const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 < Date.now();  // Check if the token has expired
  };

  // Effect to check if token is expired on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      if (isTokenExpired(savedToken)) {
        logout();  // If token is expired, log out the user
      } else {
        setToken(savedToken);  // Restore token and user session
      }
    }
  }, []);

  // Axios interceptor to handle 401 errors globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,  // Continue if the response is successful
      error => {
        if (error.response && error.response.status === 401) {
          // If a 401 error is encountered, log the user out
          logout();
          toast.error('Your session has expired. Please log in again.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        return Promise.reject(error);  // Continue rejecting the error
      }
    );

    // Cleanup interceptor on component unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Signup function
  const signup = async (userData) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, userData);
    const token = response.data.token;
    setToken(token);
    const decodedToken = jwtDecode(token);  // Decode token to get user info
    setUser({ id: decodedToken.userId, email: decodedToken.email });
    localStorage.setItem('token', token);  // Save token in localStorage for session persistence
  };

  // Signin function
  const signin = async (userData) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signin`, userData);
    const token = response.data.token;
    setToken(token);
    const decodedToken = jwtDecode(token);  // Decode token to get user info
    setUser({ id: decodedToken.userId, email: decodedToken.email });
    localStorage.setItem('token', token);  // Save token in localStorage for session persistence
  };

  // Logout function to clear session
  const logout = () => {
    setToken(null);  // Clear token state
    setUser(null);  // Clear user state
    localStorage.removeItem('token');  // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, token, signup, signin, logout }}>
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
};
