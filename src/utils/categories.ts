import { categories } from '../data/categories';
import type { ArtworkCategory, CategoryDefinition } from '../types/artwork';

export function getCategory(id: ArtworkCategory): CategoryDefinition {
  const found = categories.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown category: ${id}`);
  return found;
}

export function isArtworkCategory(value: string): value is ArtworkCategory {
  return categories.some((c) => c.id === value);
}

export function slugify(value: string): string {
  return value.
  toLowerCase().
  normalize('NFKD').
  replace(/[\u0300-\u036f]/g, '').
  replace(/[^a-z0-9]+/g, '-').
  replace(/^-+|-+$/g, '');
}