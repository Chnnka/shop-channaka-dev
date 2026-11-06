import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateCatalogQueries } from '../../api/queryKeys';
import AdminService from '../../api/services/AdminService';
import type { SaveCollectionPayload } from '../../types/artwork';

// Collection changes also change artworks (their collectionIds) and the storefront,
// so every mutation here refreshes all catalog queries.

/** Creates a collection when id is undefined, otherwise updates it */
export function useSaveCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: SaveCollectionPayload }) =>
      id ? AdminService.updateCollection(id, payload) : AdminService.createCollection(payload),
    onSuccess: () => invalidateCatalogQueries(queryClient)
  });
}

export function useSetCollectionPublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      AdminService.setCollectionPublished(id, published),
    onSuccess: () => invalidateCatalogQueries(queryClient)
  });
}

/** Moves a collection one place up (-1) or down (1) */
export function useMoveCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, direction }: { id: string; direction: -1 | 1 }) =>
      AdminService.moveCollection(id, direction),
    onSuccess: () => invalidateCatalogQueries(queryClient)
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AdminService.deleteCollection(id),
    onSuccess: () => invalidateCatalogQueries(queryClient)
  });
}
