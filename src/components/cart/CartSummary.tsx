import React from 'react';
import type { CurrencyCode } from '../../types/commerce';
import { formatPrice } from '../../utils/format';

interface CartSummaryProps {
  currency: CurrencyCode;
  subtotal: number;
  /** undefined = not chosen yet; null = will be confirmed later */
  shipping?: number | null;
  shippingNote?: string;
  children?: React.ReactNode;
}

export function CartSummary({ currency, subtotal, shipping, shippingNote, children }: CartSummaryProps) {
  const total = subtotal + (shipping ?? 0);
  return (
    <div className="bg-sand p-6 md:p-8">
      <h2 className="font-serif text-2xl font-normal">Order summary</h2>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="tabular-nums">{formatPrice(subtotal, currency)}</dd>
        </div>
        <div className="flex justify-between gap-6">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd className="text-right tabular-nums">
            {shipping === undefined ?
            'Calculated at checkout' :
            shipping === null ?
            'Confirmed by email' :
            shipping === 0 ?
            'Free' :
            `${formatPrice(shipping, currency)} (est.)`}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Taxes</dt>
          <dd className="text-right">None charged by the studio</dd>
        </div>
      </dl>
      {shippingNote && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{shippingNote}</p>}
      <div className="mt-6 flex items-baseline justify-between border-t border-linen pt-5">
        <span className="text-sm">Total{shipping === null || shipping === undefined ? ' (excl. shipping)' : ''}</span>
        <span className="font-serif text-3xl tabular-nums">{formatPrice(total, currency)}</span>
      </div>
      <p className="mt-1 text-right text-xs text-muted-foreground">Charged in {currency}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>);

}