import axios, { AxiosError, AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/config/constants';

const TOKEN_KEY = '@MindfulMeals:token';
const REFRESH_TOKEN_KEY = '@MindfulMeals:refreshToken';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          // Try to refresh the token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data;
          await AsyncStorage.setItem(TOKEN_KEY, token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
        // Navigation will be handled by auth state management
      }
    }

    // Mindful error messages
    if (error.response) {
      switch (error.response.status) {
        case 400:
          error.message = 'Please check your input and try again';
          break;
        case 404:
          error.message = 'The requested resource was not found';
          break;
        case 500:
          error.message = 'Something went wrong. Please take a breath and try again';
          break;
        default:
          error.message = error.response.data?.message || 'An unexpected error occurred';
      }
    } else if (error.request) {
      error.message = 'Unable to connect. Please check your internet connection';
    } else {
      error.message = 'Something went wrong. Please try again';
    }

    return Promise.reject(error);
  }
);

// Helper functions for token management
export const authTokens = {
  async setTokens(token: string, refreshToken: string) {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [REFRESH_TOKEN_KEY, refreshToken],
    ]);
  },

  async getTokens() {
    const values = await AsyncStorage.multiGet([TOKEN_KEY, REFRESH_TOKEN_KEY]);
    return {
      token: values[0][1],
      refreshToken: values[1][1],
    };
  },

  async clearTokens() {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
  },
};

export default apiClient;