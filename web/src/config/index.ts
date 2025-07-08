// API configuration
export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/me',
    },
    USERS: {
      BASE: '/users',
      PROFILE: '/users/me',
    },
    FRIENDS: {
      BASE: '/friends',
      REQUESTS: '/friends/requests',
    },
  },

  // Default request headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  // Request timeout in milliseconds
  TIMEOUT: 10000,
} as const;

// Environment configuration
export const ENV_CONFIG = {
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const;

// Application configuration
export const APP_CONFIG = {
  APP_NAME: 'Social Network',
  APP_VERSION: '1.0.0',
  DEFAULT_LOCALE: 'vi-VN',
  DEFAULT_THEME: 'light',
} as const;
