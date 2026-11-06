import React from 'react';
import type { CartItem } from '../../contexts/CartContext';
import type { CurrencyCode } from '../../types/commerce';
import { getCategory } from '../../utils/categories';
import { formatPrice } from '../../utils/format';
import { CartSummary } from '../cart/CartSummary';

interface Props {
  items: CartItem[];
  currency: CurrencyCode;
  subtotal: number;
  shipping: number | null | undefined;
  international: boolean;
}

export function CheckoutOrderSummary({ items, currency, subtotal, shipping, international }: Props) {
  return (
    <div>
      <ul className="mb-px divide-y divide-linen bg-sand px-6 pt-4 md:px-8">
        {items.map(({ artwork, price, line }) =>
        <li key={line.artworkId} className="flex items-center gap-4 py-4">
            <span className="flex size-16 shrink-0 items-center justify-center bg-ivory p-1.5">
              {artwork?.images[0] && <img src={artwork.images[0].src} alt="" className="max-h-full max-w-full object-contain" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-serif text-lg">{artwork?.title}</span>
              <span className="block text-xs text-muted-foreground">
                {artwork ? getCategory(artwork.category).singular : ''} · Original
              </span>
            </span>
            <span className="text-sm tabular-nums">{price != null ? formatPrice(price, currency) : '—'}</span>
          </li>
        )}
      </ul>
      <CartSummary
        currency={currency}
        subtotal={subtotal}
        shipping={shipping}
        shippingNote={
        international ?
        'International shipping depends on size and destination. We’ll email the exact cost for your approval before dispatch. Import duties may apply in your country.' :
        undefined
        } />
      
    </div>);

}