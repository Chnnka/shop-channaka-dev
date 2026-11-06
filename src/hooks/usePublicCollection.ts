import { skipToken, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import ArtworkService from '../api/services/ArtworkService';
import { artworksInCollection } from '../utils/artworkFilters';
import { publicCatalogQuery } from './usePublicCatalog';

/**
 * A published collection and its public artworks, by slug. Shows straight from the catalog
 * when it's already loaded. An unknown or unpublished slug fails with a 404 ApiError.
 */
export function usePublicCollection(slug: string | undefined) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: queryKeys.public.collection(slug ?? ''),
    queryFn: slug ? () => ArtworkService.getCollectionBySlug(slug) : skipToken,
    initialData: () => {
      const catalog = queryClient.getQueryData(publicCatalogQuery.queryKey);
      const collection = catalog?.collections.find((c) => c.slug === slug);
      return catalog && collection ?
      { collection, artworks: artworksInCollection(catalog.artworks, collection.id) } :
      undefined;
    },
    initialDataUpdatedAt: () => queryClient.getQueryState(publicCatalogQuery.queryKey)?.dataUpdatedAt
  });
}
