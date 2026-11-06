import { queryOptions, useQuery } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import ArtworkService from '../api/services/ArtworkService';
import type { Artwork, Collection } from '../types/artwork';

export type LoadStatus = 'loading' | 'ready' | 'error';

// Stable empty arrays, so components that memoise on these don't recompute on every render
const NO_ARTWORKS: Artwork[] = [];
const NO_COLLECTIONS: Collection[] = [];

/** The public catalog query on its own; queryOptions types the key, so cache reads are typed too */
export const publicCatalogQuery = queryOptions({
  queryKey: queryKeys.public.catalog,
  queryFn: () => ArtworkService.getCatalog()
});

/**
 * Every public artwork and published collection, fetched once and shared by all storefront
 * pages: the gallery, search and filters work on the full list in the browser.
 */
export function usePublicCatalog() {
  const query = useQuery(publicCatalogQuery);
  const status: LoadStatus = query.isPending ? 'loading' : query.isError ? 'error' : 'ready';
  return {
    artworks: query.data?.artworks ?? NO_ARTWORKS,
    collections: query.data?.collections ?? NO_COLLECTIONS,
    status,
    error: query.error,
    reload: () => void query.refetch()
  };
}
