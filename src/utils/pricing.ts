import { currencyConfig } from '../data/site';
import type { Artwork } from '../types/artwork';
import type { CurrencyCode, ShippingMethod } from '../types/commerce';

/**
 * Returns the artwork price in the requested currency, or null when the artist
 * hasn't set one. Conversion only happens when explicitly enabled with
 * backend-provided rates — we never invent exchange rates.
 */
export function getArtworkPrice(artwork: Artwork, currency: CurrencyCode): number | null {
  if (artwork.currency === currency) return artwork.price;
  const explicit = artwork.alternatePrices?.[currency];
  if (explicit != null) return explicit;
  const { conversion } = currencyConfig;
  const rate = conversion.enabled ? conversion.rates[artwork.currency]?.[currency] : undefined;
  return rate ? Math.round(artwork.price * rate) : null;
}

export function getShippingEstimate(method: ShippingMethod | undefined, currency: CurrencyCode): number | null {
  if (!method || !method.estimates) return null;
  return method.estimates[currency] ?? null;
}