import React from 'react';
import { X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { usePublicCatalog } from '../../hooks/usePublicCatalog';
import { categories } from '../../data/categories';
import { availabilityFilterOptions, priceBuckets, sizeBuckets } from '../../data/filters';
import type { ListKey } from '../../hooks/useArtworkFilters';
import type { GalleryFilters } from '../../utils/artworkFilters';
import { priceBucketLabel } from './FilterPanel';

interface Chip {
  key: ListKey;
  value: string;
  label: string;
}

export function ActiveFilterChips({
  filters,
  onToggle,
  onReset




}: {filters: GalleryFilters;onToggle: (key: ListKey, value: string) => void;onReset: () => void;}) {
  const { collections } = usePublicCatalog();
  const { currency } = useCart();

  const chips: Chip[] = [
  ...filters.categories.map((v) => ({ key: 'categories' as const, value: v, label: categories.find((c) => c.id === v)?.label ?? v })),
  ...filters.availability.map((v) => ({
    key: 'availability' as const,
    value: v,
    label: availabilityFilterOptions.find((o) => o.value === v)?.label ?? v
  })),
  ...filters.prices.map((v) => {
    const b = priceBuckets[currency].find((x) => x.id === v);
    return { key: 'prices' as const, value: v, label: b ? priceBucketLabel(b, currency) : v };
  }),
  ...filters.sizes.map((v) => ({ key: 'sizes' as const, value: v, label: sizeBuckets.find((s) => s.id === v)?.label ?? v })),
  ...filters.collections.map((v) => ({ key: 'collections' as const, value: v, label: collections.find((c) => c.id === v)?.title ?? v }))];


  if (!chips.length && !filters.query) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.query &&
      <span className="inline-flex items-center gap-1 rounded-full bg-sand px-3 py-1.5 text-xs">“{filters.query}”</span>
      }
      {chips.map((chip) =>
      <button
        key={`${chip.key}-${chip.value}`}
        type="button"
        onClick={() => onToggle(chip.key, chip.value)}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:border-foreground focus-visible:outline-2 focus-visible:outline-ring"
        aria-label={`Remove filter: ${chip.label}`}>
        
          {chip.label}
          <X className="size-3" aria-hidden="true" />
        </button>
      )}
      <button
        type="button"
        onClick={onReset}
        className="ml-1 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
        
        Clear all
      </button>
    </div>);

}