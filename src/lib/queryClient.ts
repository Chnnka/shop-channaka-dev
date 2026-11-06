import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '../api/apiClient';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      // Retry network errors (status 0) and 5xx, but not 4xx: those won't succeed on retry
      retry: (failureCount, error) =>
        failureCount < 2 && !(error instanceof ApiError && error.status >= 400 && error.status < 500)
    }
  }
});
