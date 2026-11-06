import { priceBuckets, sizeBuckets, type SortOption } from '../data/filters';
import type { Artwork, ArtworkCategory, Availability, Collection } from '../types/artwork';
import type { CurrencyCode } from '../types/commerce';
import { getCategory } from './categories';
import { toCentimetres } from './format';
import { getArtworkPrice } from './pricing';

export interface GalleryFilters {
  categories: ArtworkCategory[];
  collections: string[];
  availability: Availability[];
  prices: string[];
  sizes: string[];
  query: string;
  sort: SortOption;
}

export function isPublic(artwork: Artwork): boolean {
  return artwork.availability !== 'archived';
}

export function matchesQuery(artwork: Artwork, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const detailText = Object.values(artwork.details).
  filter((v): v is string => typeof v === 'string').
  join(' ');
  const haystack = [
  artwork.title,
  artwork.description,
  artwork.story,
  artwork.medium,
  getCategory(artwork.category).label,
  artwork.keywords?.join(' '),
  detailText].

  filter(Boolean).
  join(' ').
  toLowerCase();
  return q.split(/\s+/).every((term) => haystack.includes(term));
}

function longestSideCm(artwork: Artwork): number | null {
  const d = artwork.dimensions;
  if (!d || d.height == null && d.width == null) return null;
  return toCentimetres(Math.max(d.height ?? 0, d.width ?? 0), d.unit);
}

export function applyFilters(
list: Artwork[],
filters: GalleryFilters,
currency: CurrencyCode)
: Artwork[] {
  const buckets = priceBuckets[currency];
  return list.filter((a) => {
    if (!isPublic(a)) return false;
    if (filters.categories.length && !filters.categories.includes(a.category)) return false;
    if (filters.availability.length && !filters.availability.includes(a.availability)) return false;
    if (filters.collections.length && !filters.collections.some((c) => a.collectionIds.includes(c)))
    return false;
    if (filters.prices.length) {
      const price = getArtworkPrice(a, currency);
      if (price == null) return false;
      const ok = filters.prices.some((id) => {
        const b = buckets.find((x) => x.id === id);
        return b ? price >= b.min && (b.max == null || price < b.max) : false;
      });
      if (!ok) return false;
    }
    if (filters.sizes.length) {
      const side = longestSideCm(a);
      if (side == null) return false;
      const ok = filters.sizes.some((id) => {
        const b = sizeBuckets.find((x) => x.id === id);
        return b ? side >= b.min && (b.max == null || side < b.max) : false;
      });
      if (!ok) return false;
    }
    return matchesQuery(a, filters.query);
  });
}

const availabilityRank: Record<Availability, number> = { available: 0, reserved: 1, sold: 2, archived: 3 };

export function sortArtworks(list: Artwork[], sort: SortOption, currency: CurrencyCode): Artwork[] {
  const priceOf = (a: Artwork) => getArtworkPrice(a, currency) ?? Number.POSITIVE_INFINITY;
  const copy = [...list];
  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'price-asc':
      return copy.sort((a, b) => priceOf(a) - priceOf(b));
    case 'price-desc':
      return copy.sort((a, b) => {
        const pa = getArtworkPrice(a, currency) ?? -1;
        const pb = getArtworkPrice(b, currency) ?? -1;
        return pb - pa;
      });
    case 'title-asc':
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return copy.sort(
        (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        availabilityRank[a.availability] - availabilityRank[b.availability] ||
        b.createdAt.localeCompare(a.createdAt)
      );
  }
}

export function publishedCollections(list: Collection[]): Collection[] {
  return list.filter((c) => c.published).sort((a, b) => a.order - b.order);
}

export function artworksInCollection(list: Artwork[], collectionId: string): Artwork[] {
  return list.filter((a) => isPublic(a) && a.collectionIds.includes(collectionId));
}