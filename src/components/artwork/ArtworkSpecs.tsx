import React from 'react';
import type { Artwork } from '../../types/artwork';
import { getCategory } from '../../utils/categories';
import { dimensionParts, formatWeight } from '../../utils/format';

interface SpecRow {
  label: string;
  value: string;
}

/** Builds only the rows that actually have values — never shows empty labels. */
export function buildSpecRows(artwork: Artwork): SpecRow[] {
  const category = getCategory(artwork.category);
  const rows: SpecRow[] = [{ label: 'Category', value: category.singular }];
  if (artwork.medium) rows.push({ label: category.mediumLabel, value: artwork.medium });
  dimensionParts(artwork.dimensions).forEach((p) => rows.push(p));
  const weight = formatWeight(artwork.weight);
  if (weight) rows.push({ label: 'Weight', value: weight });
  category.fields.forEach((field) => {
    const raw = artwork.details[field.key];
    if (raw === undefined || raw === '') return;
    if (typeof raw === 'boolean') {
      rows.push({ label: field.label, value: raw ? 'Yes' : 'No' });
    } else if (raw.trim()) {
      rows.push({ label: field.label, value: raw });
    }
  });
  if (artwork.year) rows.push({ label: 'Year', value: String(artwork.year) });
  if (artwork.sku) rows.push({ label: 'Reference', value: artwork.sku });
  return rows;
}

export function ArtworkSpecs({ artwork }: {artwork: Artwork;}) {
  const rows = buildSpecRows(artwork);
  return (
    <dl className="divide-y divide-border border-y border-border">
      {rows.map((row) =>
      <div key={row.label} className="grid grid-cols-[minmax(0,140px)_1fr] gap-6 py-3.5 text-sm sm:grid-cols-[180px_1fr]">
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd className="text-foreground">{row.value}</dd>
        </div>
      )}
    </dl>);

}