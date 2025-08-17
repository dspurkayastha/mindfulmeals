import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, authTokens } from '@/api/client';
import { useCallback, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/config/constants';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData extends LoginCredentials {
  name: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    householdId?: string;
  };
  token: string;
  refreshToken: string;
}

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return data;
    },
    onSuccess: async (data) => {
      // Store tokens
      await authTokens.setTokens(data.token, data.refreshToken);
      
      // Update user data in cache
      queryClient.setQueryData(['currentUser'], data.user);
      
      // Show welcome message
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: `Great to see you again, ${data.user.name}`,
        position: 'top',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: 'Please check your credentials and try again',
        position: 'top',
      });
    },
  });
};

// Signup mutation
export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (signupData: SignupData) => {
      const { data } = await apiClient.post<AuthResponse>('/auth/signup', signupData);
      return data;
    },
    onSuccess: async (data) => {
      // Store tokens
      await authTokens.setTokens(data.token, data.refreshToken);
      
      // Update user data in cache
      queryClient.setQueryData(['currentUser'], data.user);
      
      // Show welcome message
      Toast.show({
        type: 'success',
        text1: 'Welcome to MindfulMeals!',
        text2: 'Let\'s begin your mindful eating journey',
        position: 'top',
      });
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Call logout endpoint (optional - depends on backend)
      try {
        await apiClient.post('/auth/logout');
      } catch {
        // Silent fail - we'll clear local data anyway
      }
    },
    onSuccess: async () => {
      // Clear tokens
      await authTokens.clearTokens();
      
      // Clear all cached data
      queryClient.clear();
      
      // Show farewell message
      Toast.show({
        type: 'info',
        text1: 'See you soon!',
        text2: 'Keep nurturing your mindful eating habits',
        position: 'top',
      });
    },
  });
};

// Get current user query
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await apiClient.get('/auth/me');
      return data.user;
    },
    retry: false, // Don't retry if user is not authenticated
    staleTime: Infinity, // User data doesn't change often
  });
};

// Check auth status - MOCK VERSION FOR MVP
export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          // Mock user data
          setUser({
            id: '1',
            name: 'Demo User',
            email: 'demo@mindfulmeals.com',
            householdId: 'household-1', // Set this to null to show household setup
          });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);
  
  return {
    isAuthenticated,
    isLoading,
    user,
  };
};

// Refresh token hook
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async () => {
      const { refreshToken } = await authTokens.getTokens();
      if (!refreshToken) throw new Error('No refresh token');
      
      const { data } = await apiClient.post<{ token: string }>('/auth/refresh', {
        refreshToken,
      });
      
      return data.token;
    },
    onSuccess: async (newToken) => {
      const { refreshToken } = await authTokens.getTokens();
      if (refreshToken) {
        await authTokens.setTokens(newToken, refreshToken);
      }
    },
  });
};