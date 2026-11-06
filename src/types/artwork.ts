import type { CurrencyCode } from './commerce';

export type ArtworkCategory =
'pencil-drawing' |
'canvas-painting' |
'mixed-media-painting' |
'mixed-media-drawing' |
'pebble-painting' |
'wall-painting' |
'paper-painting';

export type Availability = 'available' | 'reserved' | 'sold' | 'archived';
export type LengthUnit = 'cm' | 'mm';
export type WeightUnit = 'g' | 'kg';
export type ImageKind = 'artwork' | 'detail' | 'room' | 'process';

export interface ArtworkImage {
  id: string;
  src: string;
  alt: string;
  kind: ImageKind;
  /** width / height, used to reserve space and avoid layout shift */
  aspectRatio?: number;
}

export interface ArtworkDimensions {
  height?: number;
  width?: number;
  depth?: number;
  unit: LengthUnit;
}

export interface ArtworkWeight {
  value: number;
  unit: WeightUnit;
}

export type CategoryDetailValue = string | boolean;
/** Category-specific, configurable attributes keyed by CategoryFieldDefinition.key */
export type CategoryDetails = Record<string, CategoryDetailValue | undefined>;

export interface ArtworkSeo {
  title?: string;
  description?: string;
}

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  description?: string;
  story?: string;
  category: ArtworkCategory;
  images: ArtworkImage[];
  price: number;
  currency: CurrencyCode;
  /** Explicit artist-set prices in other currencies (never auto-converted). */
  alternatePrices?: Partial<Record<CurrencyCode, number>>;
  dimensions?: ArtworkDimensions;
  weight?: ArtworkWeight;
  medium?: string;
  year?: number;
  collectionIds: string[];
  availability: Availability;
  featured: boolean;
  sku?: string;
  keywords?: string[];
  details: CategoryDetails;
  seo?: ArtworkSeo;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  coverAlt: string;
  published: boolean;
  order: number;
}

export type FieldRequirement = 'required' | 'optional' | 'hidden';
export type CategoryFieldType = 'text' | 'textarea' | 'select' | 'boolean';

export interface CategoryFieldDefinition {
  key: string;
  label: string;
  type: CategoryFieldType;
  placeholder?: string;
  options?: string[];
  helpText?: string;
}

export interface CategoryDefinition {
  id: ArtworkCategory;
  label: string;
  singular: string;
  description: string;
  coverImage: string;
  dimensions: FieldRequirement;
  weight: FieldRequirement;
  mediumLabel: string;
  fields: CategoryFieldDefinition[];
}

/**
 * Body for POST /api/admin/artworks (also accepted by PUT /api/admin/artworks/:id).
 * The server sets createdAt and updatedAt, and generates an id when none is given.
 * Unknown fields are rejected. Server rules worth knowing:
 * - slug: at least 2 chars, lowercase letters, numbers and single hyphens; must be unique
 * - title: 2–160 chars · images: 1–30 · price and every size/weight: greater than 0
 * - year: whole number from 1000 to next year
 * - details: each value a boolean or a string of at most 2000 chars
 * - collectionIds: must all be existing collections
 */
export type CreateArtworkPayload = Omit<Artwork, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
};

/**
 * Body for POST /api/admin/collections and PUT /api/admin/collections/:id.
 * artworkIds become exactly the collection's artworks (others are removed from it).
 * The server generates the id and order on create, and keeps both on update.
 * Server rules: title 2–160 chars, description 10–3000 chars, slug must be unique.
 */
export interface SaveCollectionPayload {
  collection: Omit<Collection, 'id' | 'order'>;
  artworkIds: string[];
}

/**
 * Query params for the public GET /api/artworks. Archived artworks are always excluded.
 * The admin GET /api/admin/artworks takes no params and returns every artwork.
 */
export type ArtworkQueryParams = {
  /** Only artworks in this category */
  category?: ArtworkCategory;
  /** true: only featured artworks. false or omitted: no filter (the server checks for "true") */
  featured?: boolean;
};