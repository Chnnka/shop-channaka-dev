import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateCatalogQueries } from '../../api/queryKeys';
import AdminService from '../../api/services/AdminService';

/** Permanently deletes an artwork, then refreshes the admin and storefront artwork lists */
export function useDeleteArtwork() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminService.deleteArtwork(id),
    onSuccess: () => invalidateCatalogQueries(queryClient)
  });
}
