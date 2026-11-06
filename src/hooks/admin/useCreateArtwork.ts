import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateCatalogQueries } from '../../api/queryKeys';
import AdminService from '../../api/services/AdminService';
import type { CreateArtworkPayload } from '../../types/artwork';

/** Creates an artwork, then refreshes the admin and storefront artwork lists */
export function useCreateArtwork() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateArtworkPayload) => AdminService.createArtwork(payload),
    onSuccess: () => invalidateCatalogQueries(queryClient)
  });
}
