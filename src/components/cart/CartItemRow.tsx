import React from 'react';
import { Link } from 'react-router-dom';
import { TriangleAlert, X } from 'lucide-react';
import type { CartItem } from '../../contexts/CartContext';
import type { CurrencyCode } from '../../types/commerce';
import { getCategory } from '../../utils/categories';
import { formatDimensionsShort, formatPrice } from '../../utils/format';
import { AvailabilityBadge } from '../artwork/AvailabilityBadge';

const issueText = {
  unavailable: 'This artwork is no longer available. Please remove it to continue.',
  missing: 'This artwork has been removed from the gallery. Please remove it to continue.',
  'no-price': 'This artwork isn’t priced in the selected currency. Switch currency or remove it.'
};

export function CartItemRow({
  item,
  currency,
  onRemove




}: {item: CartItem;currency: CurrencyCode;onRemove: () => void;}) {
  const { artwork, price, issue } = item;
  return (
    <li className="flex gap-5 py-7 sm:gap-8">
      <div className="flex size-24 shrink-0 items-center justify-center bg-sand p-2 sm:size-32 sm:p-3">
        {artwork?.images[0] &&
        <img src={artwork.images[0].src} alt="" className="max-h-full max-w-full object-contain" loading="lazy" />
        }
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {artwork ?
            <Link to={`/artwork/${artwork.slug}`} className="font-serif text-2xl leading-tight hover:text-earth">
                {artwork.title}
              </Link> :

            <span className="font-serif text-2xl text-muted-foreground">Unavailable artwork</span>
            }
            {artwork &&
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {getCategory(artwork.category).singular}
                {formatDimensionsShort(artwork.dimensions) && ` · ${formatDimensionsShort(artwork.dimensions)}`}
              </p>
            }
          </div>
          <p className="shrink-0 text-right tabular-nums">
            {price != null ? formatPrice(price, currency) : <span className="text-sm text-muted-foreground">—</span>}
          </p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-4 pt-4">
          <div className="flex flex-col gap-1">
            {artwork && <AvailabilityBadge availability={artwork.availability} />}
            <span className="text-xs text-muted-foreground">Original · quantity 1</span>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring"
            aria-label={`Remove ${artwork?.title ?? 'artwork'} from cart`}>
            
            <X className="size-3.5" aria-hidden="true" />
            Remove
          </button>
        </div>
        {issue &&
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-sm bg-[#f8ece8] p-3 text-xs text-[#8a2f23]">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {issueText[issue]}
          </p>
        }
      </div>
    </li>);

}