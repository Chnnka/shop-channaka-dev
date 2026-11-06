import { z } from 'zod';
import type {
  Artwork,
  ArtworkCategory,
  ArtworkImage,
  Availability,
  CategoryDetails,
  CreateArtworkPayload,
  LengthUnit,
  WeightUnit } from
'../types/artwork';
import type { CurrencyCode } from '../types/commerce';
import { getCategory, isArtworkCategory } from './categories';

export interface ArtworkFormValues {
  title: string;
  slug: string;
  description: string;
  story: string;
  category: ArtworkCategory | '';
  price: string;
  currency: CurrencyCode;
  alternatePrice: string;
  images: ArtworkImage[];
  height: string;
  width: string;
  depth: string;
  lengthUnit: LengthUnit;
  weight: string;
  weightUnit: WeightUnit;
  medium: string;
  details: CategoryDetails;
  availability: Availability;
  featured: boolean;
  collectionIds: string[];
  year: string;
  sku: string;
  keywords: string;
  seoTitle: string;
  seoDescription: string;
}

export type ArtworkFormErrors = Record<string, string>;

export const otherCurrency = (c: CurrencyCode): CurrencyCode => c === 'LKR' ? 'USD' : 'LKR';

const str = (n?: number) => n == null ? '' : String(n);

export function toFormValues(a?: Artwork): ArtworkFormValues {
  const currency = a?.currency ?? 'LKR';
  return {
    title: a?.title ?? '',
    slug: a?.slug ?? '',
    description: a?.description ?? '',
    story: a?.story ?? '',
    category: a?.category ?? '',
    price: str(a?.price),
    currency,
    alternatePrice: str(a?.alternatePrices?.[otherCurrency(currency)]),
    images: a?.images ?? [],
    height: str(a?.dimensions?.height),
    width: str(a?.dimensions?.width),
    depth: str(a?.dimensions?.depth),
    lengthUnit: a?.dimensions?.unit ?? 'cm',
    weight: str(a?.weight?.value),
    weightUnit: a?.weight?.unit ?? 'g',
    medium: a?.medium ?? '',
    details: { ...(a?.details ?? {}) },
    availability: a?.availability ?? 'available',
    featured: a?.featured ?? false,
    collectionIds: a?.collectionIds ?? [],
    year: str(a?.year),
    sku: a?.sku ?? '',
    keywords: a?.keywords?.join(', ') ?? '',
    seoTitle: a?.seo?.title ?? '',
    seoDescription: a?.seo?.description ?? ''
  };
}

const num = (v: string): number | undefined => v.trim() === '' ? undefined : Number(v);
const isPositive = (v: string) => v.trim() !== '' && Number.isFinite(Number(v)) && Number(v) > 0;
const blankOrPositive = (v: string) => v.trim() === '' || isPositive(v);

const baseSchema = z.object({
  title: z.string().trim().min(2, 'Enter a title'),
  slug: z.
  string().
  trim().
  min(2, 'Enter a URL slug').
  regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and single hyphens only'),
  category: z.string().min(1, 'Choose a category'),
  price: z.string().refine(isPositive, 'Enter a price greater than 0'),
  alternatePrice: z.string().refine(blankOrPositive, 'Enter a valid price, or leave blank'),
  year: z.
  string().
  refine((v) => v.trim() === '' || /^\d{4}$/.test(v.trim()) && Number(v) <= new Date().getFullYear() + 1, 'Enter a valid 4-digit year'),
  seoTitle: z.string().max(70, 'Keep the SEO title under 70 characters'),
  seoDescription: z.string().max(160, 'Keep the SEO description under 160 characters'),
  depth: z.string().refine(blankOrPositive, 'Enter a positive number')
});

export function validateArtworkForm(v: ArtworkFormValues, takenSlugs: string[]): ArtworkFormErrors {
  const errors: ArtworkFormErrors = {};
  const parsed = baseSchema.safeParse(v);
  if (!parsed.success) {
    parsed.error.issues.forEach((i) => {
      const key = String(i.path[0]);
      if (!errors[key]) errors[key] = i.message;
    });
  }
  if (!errors.slug && takenSlugs.includes(v.slug.trim())) errors.slug = 'Another artwork already uses this slug';
  if (v.images.length === 0) errors.images = 'Add at least one image';else
  if (v.images.some((img) => !img.alt.trim())) errors.images = 'Add descriptive alt text to every image';

  if (v.category && isArtworkCategory(v.category)) {
    const def = getCategory(v.category);
    if (def.dimensions === 'required') {
      if (!isPositive(v.height)) errors.height = 'Height is required';
      if (!isPositive(v.width)) errors.width = 'Width is required';
    } else if (def.dimensions === 'optional') {
      if (!blankOrPositive(v.height)) errors.height = 'Enter a positive number';
      if (!blankOrPositive(v.width)) errors.width = 'Enter a positive number';
    }
    if (def.weight === 'required' && !isPositive(v.weight)) errors.weight = 'Weight is required for this category';
    if (def.weight === 'optional' && !blankOrPositive(v.weight)) errors.weight = 'Enter a positive number';
  }
  return errors;
}

/** Builds the request body for creating or updating an artwork. The server sets id and timestamps. */
export function fromFormValues(v: ArtworkFormValues): CreateArtworkPayload {
  if (!v.category) throw new Error('Category is required');
  const def = getCategory(v.category);
  const fieldKeys = def.fields.map((f) => f.key);
  const details: CategoryDetails = {};
  fieldKeys.forEach((k) => {
    const val = v.details[k];
    if (typeof val === 'boolean' || typeof val === 'string' && val.trim()) details[k] = typeof val === 'string' ? val.trim() : val;
  });
  const height = num(v.height);
  const width = num(v.width);
  const depth = num(v.depth);
  const hasDims = def.dimensions !== 'hidden' && (height != null || width != null);
  const weightValue = num(v.weight);
  const altPrice = num(v.alternatePrice);

  return {
    slug: v.slug.trim(),
    title: v.title.trim(),
    description: v.description.trim() || undefined,
    story: v.story.trim() || undefined,
    category: v.category,
    images: v.images.map((img, i) => i === 0 && img.kind !== 'room' ? { ...img, kind: 'artwork' } : img),
    price: Number(v.price),
    currency: v.currency,
    alternatePrices: altPrice != null ? { [otherCurrency(v.currency)]: altPrice } : undefined,
    dimensions: hasDims ? { height, width, depth, unit: v.lengthUnit } : undefined,
    weight: def.weight !== 'hidden' && weightValue != null ? { value: weightValue, unit: v.weightUnit } : undefined,
    medium: v.medium.trim() || undefined,
    year: num(v.year),
    collectionIds: v.collectionIds,
    availability: v.availability,
    featured: v.featured,
    sku: v.sku.trim() || undefined,
    keywords: v.keywords.
    split(',').
    map((k) => k.trim()).
    filter(Boolean),
    details,
    seo: v.seoTitle.trim() || v.seoDescription.trim() ? { title: v.seoTitle.trim() || undefined, description: v.seoDescription.trim() || undefined } : undefined
  };
}

const serverFieldAliases: Record<string, string> = {
  'dimensions.height': 'height',
  'dimensions.width': 'width',
  'dimensions.depth': 'depth',
  'weight.value': 'weight',
  'seo.title': 'seoTitle',
  'seo.description': 'seoDescription'
};

/**
 * Maps the server's validation errors (keyed by request path, e.g. "images[0].alt",
 * "alternatePrices.USD") onto form field keys. Errors with no matching field are returned
 * separately so they can still be shown.
 */
export function toFormErrors(fieldErrors: Record<string, string>) {
  const errors: ArtworkFormErrors = {};
  const unmatched: string[] = [];
  const formKeys = new Set<string>(Object.keys(toFormValues()));
  Object.entries(fieldErrors).forEach(([field, message]) => {
    const root = field.split(/[.[]/)[0];
    let key = serverFieldAliases[field] ?? root;
    if (root === 'alternatePrices') key = 'alternatePrice';
    if (formKeys.has(key) && key !== 'details') {
      errors[key] ??= message;
    } else {
      unmatched.push(`${field}: ${message}`);
    }
  });
  return { errors, unmatched };
}