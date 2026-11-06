import type { ArtworkDimensions, ArtworkWeight } from '../types/artwork';
import type { CurrencyCode } from '../types/commerce';

const localeFor: Record<CurrencyCode, string> = { LKR: 'en-LK', USD: 'en-US' };

export function formatPrice(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(localeFor[currency], {
    style: 'currency',
    currency,
    currencyDisplay: currency === 'LKR' ? 'code' : 'symbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'LKR' ? 0 : 2
  }).format(amount);
}

function trimNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '');
}

export interface MeasurementPart {
  label: string;
  value: string;
}

export function dimensionParts(d?: ArtworkDimensions): MeasurementPart[] {
  if (!d) return [];
  const parts: MeasurementPart[] = [];
  if (d.height != null) parts.push({ label: 'Height', value: `${trimNumber(d.height)} ${d.unit}` });
  if (d.width != null) parts.push({ label: 'Width', value: `${trimNumber(d.width)} ${d.unit}` });
  if (d.depth != null) parts.push({ label: 'Depth', value: `${trimNumber(d.depth)} ${d.unit}` });
  return parts;
}

/** "Height: 40 cm | Width: 30 cm" */
export function formatDimensions(d?: ArtworkDimensions): string | null {
  const parts = dimensionParts(d);
  if (!parts.length) return null;
  return parts.map((p) => `${p.label}: ${p.value}`).join(' | ');
}

/** "40 × 30 cm" */
export function formatDimensionsShort(d?: ArtworkDimensions): string | null {
  if (!d || d.height == null || d.width == null) return null;
  return `${trimNumber(d.height)} × ${trimNumber(d.width)} ${d.unit}`;
}

export function formatWeight(w?: ArtworkWeight): string | null {
  if (!w) return null;
  return `${trimNumber(w.value)} ${w.unit}`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
}

export function toCentimetres(value: number, unit: 'cm' | 'mm'): number {
  return unit === 'mm' ? value / 10 : value;
}