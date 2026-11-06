import React from 'react';
import { useCart } from '../../contexts/CartContext';
import type { Artwork } from '../../types/artwork';
import { cn } from '../../utils/cn';
import { formatPrice } from '../../utils/format';
import { getArtworkPrice } from '../../utils/pricing';

interface ArtworkPriceProps {
  artwork: Artwork;
  className?: string;
}

/** Price in the visitor's selected currency. Falls back to the listed currency, clearly labelled. */
export function ArtworkPrice({ artwork, className }: ArtworkPriceProps) {
  const { currency } = useCart();
  const price = getArtworkPrice(artwork, currency);
  const muted = artwork.availability === 'sold';

  if (price == null) {
    return (
      <span className={cn('text-sm', className)}>
        {formatPrice(artwork.price, artwork.currency)}
        <span className="ml-1 text-xs text-muted-foreground">(listed in {artwork.currency})</span>
      </span>);

  }
  return (
    <span className={cn('tabular-nums', muted && 'text-muted-foreground line-through decoration-1', className)}>
      {formatPrice(price, currency)}
    </span>);

}