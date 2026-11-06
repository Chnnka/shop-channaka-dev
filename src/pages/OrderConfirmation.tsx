import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { CircleCheck, PackageSearch } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { PrototypeNotice } from '../components/common/PrototypeNotice';
import { TextLink } from '../components/common/TextLink';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Order } from '../types/commerce';
import { formatPrice } from '../utils/format';

export function OrderConfirmation() {
  const { orderNumber } = useParams();
  // Checkout passes the new order in the navigation state: customers can't look orders up from
  // the API. The browser keeps that state on refresh, but a typed or shared link has none.
  const { state } = useLocation() as {state: {order?: Order;} | null;};
  usePageMeta({ title: 'Order confirmed' });
  const order = state?.order?.orderNumber === orderNumber ? state?.order : undefined;

  if (!order) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Order not found"
        description="We couldn’t find that order. If you’ve just placed it, check your email for confirmation."
        action={<TextLink to="/gallery">Back to the gallery</TextLink>}
        className="py-32" />);


  }

  const pendingPayment = order.paymentStatus === 'pending';

  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 pt-16 md:pt-24">
      <div className="text-center">
        <CircleCheck className="mx-auto size-10 text-[#6b7f4e]" strokeWidth={1.25} aria-hidden="true" />
        <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-earth">Order {order.orderNumber}</p>
        <h1 className="mt-4 font-serif text-5xl font-normal leading-tight">Thank you, {order.customer.name.split(' ')[0]}.</h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          {pendingPayment ?
          'Your artwork is reserved for 48 hours. We’ve sent bank transfer details to ' :
          'Your order is confirmed. A confirmation has been sent to '}
          <span className="text-foreground">{order.customer.email}</span>.
        </p>
      </div>
      <PrototypeNotice className="mt-8">
        Prototype confirmation — no payment was processed and no email was sent.
      </PrototypeNotice>

      <div className="mt-10 bg-sand p-6 md:p-8">
        <ul className="divide-y divide-linen">
          {order.lines.map((l) =>
          <li key={l.artworkId} className="flex items-center gap-4 py-4 first:pt-0">
              <span className="flex size-16 shrink-0 items-center justify-center bg-ivory p-1.5">
                <img src={l.image} alt="" className="max-h-full max-w-full object-contain" />
              </span>
              <span className="flex-1">
                <span className="block font-serif text-lg">{l.title}</span>
                <span className="block text-xs text-muted-foreground">{l.categoryLabel}</span>
              </span>
              <span className="text-sm tabular-nums">{formatPrice(l.price, order.currency)}</span>
            </li>
          )}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-linen pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping · {order.shippingMethod}</dt>
            <dd>{order.shipping == null ? 'Quoted by email' : formatPrice(order.shipping, order.currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Payment</dt>
            <dd>{order.paymentMethod}</dd>
          </div>
          <div className="flex items-baseline justify-between pt-2">
            <dt>Total</dt>
            <dd className="font-serif text-2xl">{formatPrice(order.total, order.currency)}</dd>
          </div>
        </dl>
      </div>
      <div className="mt-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Shipping to</p>
        <p className="mt-1">
          {[order.shippingAddress.line1, order.shippingAddress.line2, order.shippingAddress.city, order.shippingAddress.region, order.shippingAddress.postalCode, order.shippingAddress.country].
          filter(Boolean).
          join(', ')}
        </p>
      </div>
      <div className="mt-12 text-center">
        <TextLink to="/gallery">Continue exploring</TextLink>
      </div>
    </div>);

}