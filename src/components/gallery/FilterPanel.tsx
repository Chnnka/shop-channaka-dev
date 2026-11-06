import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { usePublicCatalog } from '../../hooks/usePublicCatalog';
import { categories } from '../../data/categories';
import { availabilityFilterOptions, priceBuckets, sizeBuckets, type PriceBucket } from '../../data/filters';
import type { ListKey } from '../../hooks/useArtworkFilters';
import type { CurrencyCode } from '../../types/commerce';
import { isPublic, publishedCollections, type GalleryFilters } from '../../utils/artworkFilters';
import { formatPrice } from '../../utils/format';
import { Checkbox } from '../ui/Checkbox';

interface FilterPanelProps {
  filters: GalleryFilters;
  onToggle: (key: ListKey, value: string) => void;
}

export function priceBucketLabel(b: PriceBucket, currency: CurrencyCode): string {
  if (b.min === 0 && b.max != null) return `Under ${formatPrice(b.max, currency)}`;
  if (b.max == null) return `${formatPrice(b.min, currency)} and above`;
  return `${formatPrice(b.min, currency)} – ${formatPrice(b.max, currency)}`;
}

export function FilterPanel({ filters, onToggle }: FilterPanelProps) {
  const { artworks, collections } = usePublicCatalog();
  const { currency } = useCart();
  const visible = artworks.filter(isPublic);
  const countFor = (cat: string) => visible.filter((a) => a.category === cat).length;

  return (
    <div className="flex flex-col divide-y divide-border">
      <FilterGroup title="Category">
        {categories.map((c) =>
        <FilterOption
          key={c.id}
          id={`f-cat-${c.id}`}
          label={c.label}
          count={countFor(c.id)}
          checked={filters.categories.includes(c.id)}
          onChange={() => onToggle('categories', c.id)} />

        )}
      </FilterGroup>
      <FilterGroup title="Availability">
        {availabilityFilterOptions.map((o) =>
        <FilterOption
          key={o.value}
          id={`f-av-${o.value}`}
          label={o.label}
          checked={filters.availability.includes(o.value as GalleryFilters['availability'][number])}
          onChange={() => onToggle('availability', o.value)} />

        )}
      </FilterGroup>
      <FilterGroup title={`Price (${currency})`}>
        {priceBuckets[currency].map((b) =>
        <FilterOption
          key={b.id}
          id={`f-price-${b.id}`}
          label={priceBucketLabel(b, currency)}
          checked={filters.prices.includes(b.id)}
          onChange={() => onToggle('prices', b.id)} />

        )}
      </FilterGroup>
      <FilterGroup title="Size" hint="Longest side">
        {sizeBuckets.map((b) =>
        <FilterOption
          key={b.id}
          id={`f-size-${b.id}`}
          label={b.label}
          meta={b.hint}
          checked={filters.sizes.includes(b.id)}
          onChange={() => onToggle('sizes', b.id)} />

        )}
      </FilterGroup>
      <FilterGroup title="Collection">
        {publishedCollections(collections).map((c) =>
        <FilterOption
          key={c.id}
          id={`f-col-${c.id}`}
          label={c.title}
          checked={filters.collections.includes(c.id)}
          onChange={() => onToggle('collections', c.id)} />

        )}
      </FilterGroup>
    </div>);

}

function FilterGroup({ title, hint, children }: {title: string;hint?: string;children: React.ReactNode;}) {
  return (
    <fieldset className="py-6 first:pt-0">
      <legend className="mb-4 flex w-full items-baseline justify-between text-[11px] uppercase tracking-[0.22em] text-foreground">
        {title}
        {hint && <span className="normal-case tracking-normal text-muted-foreground">{hint}</span>}
      </legend>
      <div className="flex flex-col gap-3">{children}</div>
    </fieldset>);

}

function FilterOption({
  id,
  label,
  meta,
  count,
  checked,
  onChange







}: {id: string;label: string;meta?: string;count?: number;checked: boolean;onChange: () => void;}) {
  return (
    <div className="flex items-center gap-3">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <label htmlFor={id} className="flex flex-1 cursor-pointer items-baseline justify-between gap-2 text-sm text-[#4a443d]">
        <span>
          {label}
          {meta && <span className="ml-1.5 text-xs text-muted-foreground">{meta}</span>}
        </span>
        {count !== undefined && <span className="text-xs tabular-nums text-muted-foreground">{count}</span>}
      </label>
    </div>);

}