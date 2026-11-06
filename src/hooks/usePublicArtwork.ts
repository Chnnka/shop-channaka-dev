import { skipToken, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import ArtworkService from '../api/services/ArtworkService';
import { publicCatalogQuery } from './usePublicCatalog';

/**
 * One public artwork by slug. When the catalog is already loaded (e.g. arriving from the
 * gallery), the artwork shows straight from it; a direct link fetches just this artwork.
 * An unknown or archived slug fails with a 404 ApiError.
 */
export function usePublicArtwork(slug: string | undefined) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: queryKeys.public.artwork(slug ?? ''),
    queryFn: slug ? () => ArtworkService.getArtworkBySlug(slug) : skipToken,
    initialData: () =>
      queryClient.getQueryData(publicCatalogQuery.queryKey)?.artworks.find((a) => a.slug === slug),
    // Treat that copy as being as old as the catalog, so it's refetched once the catalog is stale
    initialDataUpdatedAt: () => queryClient.getQueryState(publicCatalogQuery.queryKey)?.dataUpdatedAt
  });
}
