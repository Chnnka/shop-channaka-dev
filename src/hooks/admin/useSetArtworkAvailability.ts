import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateCatalogQueries } from '../../api/queryKeys';
import AdminService from '../../api/services/AdminService';
import type { Availability } from '../../types/artwork';

/** Changes an artwork's availability (e.g. sold, archived), then refreshes the admin and storefront artwork lists */
export function useSetArtworkAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, availability }: { id: string; availability: Availability }) =>
      AdminService.setArtworkAvailability(id, availability),
    onSuccess: () => invalidateCatalogQueries(queryClient)
  });
}
