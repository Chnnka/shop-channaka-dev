import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { sortOptions, type SortOption } from '../data/filters';
import type { ArtworkCategory, Availability } from '../types/artwork';
import type { GalleryFilters } from '../utils/artworkFilters';

type ListKey = 'categories' | 'collections' | 'availability' | 'prices' | 'sizes';

const paramFor: Record<ListKey, string> = {
  categories: 'category',
  collections: 'collection',
  availability: 'availability',
  prices: 'price',
  sizes: 'size'
};

function readList(params: URLSearchParams, key: string): string[] {
  return params.get(key)?.split(',').filter(Boolean) ?? [];
}

/** Gallery filter state, stored in the URL so filtered views are shareable. */
export function useArtworkFilters() {
  const [params, setParams] = useSearchParams();

  const filters = useMemo<GalleryFilters>(() => {
    const sortParam = params.get('sort');
    const sort = sortOptions.some((o) => o.value === sortParam) ? sortParam as SortOption : 'featured';
    return {
      categories: readList(params, 'category') as ArtworkCategory[],
      collections: readList(params, 'collection'),
      availability: readList(params, 'availability') as Availability[],
      prices: readList(params, 'price'),
      sizes: readList(params, 'size'),
      query: params.get('q') ?? '',
      sort
    };
  }, [params]);

  const update = useCallback(
    (patch: Partial<GalleryFilters>) => {
      const next = { ...filters, ...patch };
      const p = new URLSearchParams();
      (Object.keys(paramFor) as ListKey[]).forEach((key) => {
        const list = next[key] as string[];
        if (list.length) p.set(paramFor[key], list.join(','));
      });
      if (next.query.trim()) p.set('q', next.query);
      if (next.sort !== 'featured') p.set('sort', next.sort);
      setParams(p, { replace: true });
    },
    [filters, setParams]
  );

  const toggle = useCallback(
    (key: ListKey, value: string) => {
      const list = filters[key] as string[];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      update({ [key]: next } as Partial<GalleryFilters>);
    },
    [filters, update]
  );

  const reset = useCallback(() => {
    update({ categories: [], collections: [], availability: [], prices: [], sizes: [], query: '' });
  }, [update]);

  const activeCount =
  filters.categories.length +
  filters.collections.length +
  filters.availability.length +
  filters.prices.length +
  filters.sizes.length;

  return { filters, update, toggle, reset, activeCount };
}

export type { ListKey };