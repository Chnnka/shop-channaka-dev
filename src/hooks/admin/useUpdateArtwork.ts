import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateCatalogQueries } from '../../api/queryKeys';
import AdminService from '../../api/services/AdminService';
import type { CreateArtworkPayload } from '../../types/artwork';

/** Saves changes to an existing artwork, then refreshes the admin and storefront artwork lists */
export function useUpdateArtwork() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateArtworkPayload }) =>
      AdminService.updateArtwork(id, payload),
    onSuccess: () => invalidateCatalogQueries(queryClient)
  });
}
