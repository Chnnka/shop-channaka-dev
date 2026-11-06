import type { CurrencyCode } from '../types/commerce';

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'title-asc';

export const sortOptions: {value: SortOption;label: string;}[] = [
{ value: 'featured', label: 'Featured' },
{ value: 'newest', label: 'Newest' },
{ value: 'price-asc', label: 'Price: low to high' },
{ value: 'price-desc', label: 'Price: high to low' },
{ value: 'title-asc', label: 'Title: A–Z' }];


export interface PriceBucket {
  id: string;
  min: number;
  max: number | null;
}

export const priceBuckets: Record<CurrencyCode, PriceBucket[]> = {
  LKR: [
  { id: 'p1', min: 0, max: 25000 },
  { id: 'p2', min: 25000, max: 75000 },
  { id: 'p3', min: 75000, max: 150000 },
  { id: 'p4', min: 150000, max: null }],

  USD: [
  { id: 'p1', min: 0, max: 100 },
  { id: 'p2', min: 100, max: 250 },
  { id: 'p3', min: 250, max: 500 },
  { id: 'p4', min: 500, max: null }]

};

/** Size buckets use the longest side, measured in centimetres. */
export const sizeBuckets = [
{ id: 'small', label: 'Small', hint: 'under 30 cm', min: 0, max: 30 },
{ id: 'medium', label: 'Medium', hint: '30–60 cm', min: 30, max: 60 },
{ id: 'large', label: 'Large', hint: '60–100 cm', min: 60, max: 100 },
{ id: 'oversized', label: 'Oversized', hint: 'over 100 cm', min: 100, max: null }];


export const availabilityFilterOptions = [
{ value: 'available', label: 'Available' },
{ value: 'reserved', label: 'Reserved' },
{ value: 'sold', label: 'Sold' }];