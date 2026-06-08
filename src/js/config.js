import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3
  },
  SECURITY: {
    PIN_LENGTH: 4,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    TOKEN_STORAGE_KEY: 'auth_token',
    REFRESH_TOKEN_KEY: 'refresh_token'
  },
  VALIDATION: {
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
    PHONE_REGEX: /^\+?[0-9]{10,15}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PIN_REGEX: /^[0-9]{4}$/
  },
  PAYMENT: {
    MIN_INSTALLMENT: 100000,
    FULL_AMOUNT: 385000,
    BANK: {
      PROVIDER: 'MONIEPOINT',
      ACCOUNT: '6166119553',
      NAME: 'TrootServices'
    }
  },
  UI: {
    TOAST_DURATION: 5000,
    ANIMATION_DURATION: 300
  }
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTH_ERROR: 'Invalid credentials. Please try again.',
  FILE_SIZE_ERROR: 'File size must be less than 5MB.',
  FILE_TYPE_ERROR: 'Invalid file type. Please upload an image or PDF.'
};

export const SUCCESS_MESSAGES = {
  REGISTRATION_COMPLETE: 'Registration successful! Please log in.',
  PAYMENT_SUBMITTED: 'Payment received. We will verify and update your status.',
  PROFILE_UPDATED: 'Profile updated successfully.'
};

export default CONFIG;
