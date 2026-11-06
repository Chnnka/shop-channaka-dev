import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ShoppingBag } from 'lucide-react';
import { CartItemRow } from '../components/cart/CartItemRow';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyState } from '../components/common/EmptyState';
import { TextLink } from '../components/common/TextLink';
import { CurrencySwitcher } from '../components/layout/CurrencySwitcher';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { useCart } from '../contexts/CartContext';
import { usePublicCatalog } from '../hooks/usePublicCatalog';
import { usePageMeta } from '../hooks/usePageMeta';

export function Cart() {
  usePageMeta({ title: 'Your Cart' });
  const { items, currency, subtotal, hasIssues, remove, count } = useCart();
  const { status } = usePublicCatalog();
  const navigate = useNavigate();

  if (count === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Every artwork in the gallery is an original. When you find one you love, add it here."
        action={<TextLink to="/gallery">Explore the gallery</TextLink>}
        className="py-32" />);


  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 pb-28 pt-10 md:px-10 md:pt-14">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-8 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-serif text-5xl font-normal md:text-6xl">Your cart</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {count} original {count === 1 ? 'artwork' : 'artworks'} · each piece is unique, so quantities are fixed at one.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          Pay in <CurrencySwitcher />
        </div>
      </div>

      <div className="mt-4 grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
        <section aria-label="Cart items">
          {status === 'loading' ?
          <div className="space-y-6 py-7">
              {items.map((i) =>
            <Skeleton key={i.line.artworkId} className="h-32 w-full bg-sand" />
            )}
            </div> :

          <ul className="divide-y divide-border">
              {items.map((item) =>
            <CartItemRow
              key={item.line.artworkId}
              item={item}
              currency={currency}
              onRemove={() => remove(item.line.artworkId)} />

            )}
            </ul>
          }
          <Link to="/gallery" className="mt-6 inline-block text-sm underline underline-offset-4 hover:text-earth">
            Continue shopping
          </Link>
        </section>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <CartSummary
            currency={currency}
            subtotal={subtotal}
            shippingNote="Within Sri Lanka from an estimated LKR 1,500 (or free studio collection). International shipping is quoted by email before dispatch.">
            
            {hasIssues &&
            <p role="alert" className="mb-4 text-sm text-destructive">
                Please resolve the items marked above before checking out.
              </p>
            }
            <Button
              className="h-12 w-full rounded-sm text-[12px] uppercase tracking-[0.2em]"
              disabled={hasIssues || status !== 'ready'}
              onClick={() => navigate('/checkout')}>
              
              <Lock className="size-4" aria-hidden="true" />
              Proceed to checkout
            </Button>
            <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
              Prices and availability are confirmed again when you place your order.
            </p>
          </CartSummary>
        </aside>
      </div>
    </div>);

}