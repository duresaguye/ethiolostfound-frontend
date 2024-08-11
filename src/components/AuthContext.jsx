import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      setAccessToken(token);
    }
    setLoading(false);

    // Axios interceptor to attach token to requests
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password
      });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setIsAuthenticated(true);
      setAccessToken(access);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const signup = async (username, email, password) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/users/signup/', {
        username,
        email,
        password
      });
      await login(username, password);
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setAccessToken(null);
  };

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      console.error('No refresh token found');
      logout();
      return;
    }

    console.log('Attempting to refresh token with:', refreshToken);

    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
      refresh: refreshToken
    });

    const newToken = response.data.access;
    console.log('New access token received:', newToken);

    setAccessToken(newToken);
    localStorage.setItem('access_token', newToken);
    return newToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    logout();
    throw error;
  }
};

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response.status === 401) {
          try {
            const newToken = await refreshToken();
            error.config.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(error.config);
          } catch (err) {
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, signup, login, logout, accessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);