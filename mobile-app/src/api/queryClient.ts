import { QueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

// Create a query client with mindful defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes - data remains fresh for mindful consumption
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes - keep data in cache for smooth experience
      cacheTime: 10 * 60 * 1000,
      // Retry with exponential backoff for resilience
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Retry delay with mindful backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on reconnect for fresh data
      refetchOnReconnect: true,
      // Don't refetch on window focus in mobile
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Show mindful error messages
      onError: (error: any) => {
        const message = error?.message || 'Something went wrong. Please try again.';
        Toast.show({
          type: 'error',
          text1: 'Oops!',
          text2: message,
          position: 'top',
          visibilityTime: 4000,
        });
      },
      // Retry mutations once
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Helper to invalidate queries mindfully
export const invalidateQueries = async (queryKey: string | string[]) => {
  await queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
};

// Helper to prefetch queries for smooth UX
export const prefetchQuery = async (
  queryKey: string | string[],
  queryFn: () => Promise<any>,
  staleTime?: number
) => {
  await queryClient.prefetchQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn,
    staleTime: staleTime || 5 * 60 * 1000,
  });
};

export default queryClient;