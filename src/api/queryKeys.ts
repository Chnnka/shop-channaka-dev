import type { QueryClient } from '@tanstack/react-query';
import type { ArtworkQueryParams } from '../types/artwork';

/**
 * TanStack Query keys, in one place so mutations can invalidate the right queries,
 * e.g. queryClient.invalidateQueries({ queryKey: queryKeys.admin.artworks.all })
 */
export const queryKeys = {
  /** Storefront data: public artworks and published collections only */
  public: {
    all: ['public'] as const,
    catalog: ['public', 'catalog'] as const,
    artwork: (slug: string) => ['public', 'artworks', slug] as const,
    collection: (slug: string) => ['public', 'collections', slug] as const
  },
  admin: {
    artworks: {
      all: ['admin', 'artworks'] as const,
      list: (params: ArtworkQueryParams) => ['admin', 'artworks', 'list', params] as const,
      detail: (id: string) => ['admin', 'artworks', 'detail', id] as const
    },
    collections: {
      all: ['admin', 'collections'] as const
    },
    orders: {
      all: ['admin', 'orders'] as const
    }
  }
};

/**
 * Refreshes every query that shows artworks or collections, on the storefront and in admin.
 * Call after anything that changes them: artwork and collection edits, and orders, which
 * reserve, sell or release artworks.
 */
export function invalidateCatalogQueries(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.public.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.artworks.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.collections.all })
  ]);
}
