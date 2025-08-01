import axios, { AxiosError } from 'axios';

const API_CONFIG = process.env.API_CONFIG || 'http://localhost:5000/v1/api';

// Axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG,
  timeout: 10000,
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

export { api };
