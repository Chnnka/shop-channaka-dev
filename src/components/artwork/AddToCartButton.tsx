import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../../contexts/CartContext';
import type { Artwork } from '../../types/artwork';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

export function AddToCartButton({ artwork, className }: {artwork: Artwork;className?: string;}) {
  const { add, isInCart } = useCart();
  const navigate = useNavigate();
  const inCart = isInCart(artwork.id);
  const base = cn('h-12 w-full rounded-sm text-[12px] uppercase tracking-[0.2em]', className);

  if (artwork.availability === 'sold' || artwork.availability === 'archived') {
    return (
      <Button disabled className={base} aria-disabled="true">
        Sold
      </Button>);

  }
  if (artwork.availability === 'reserved') {
    return (
      <Button disabled className={base} aria-disabled="true">
        Reserved
      </Button>);

  }
  if (inCart) {
    return (
      <Button variant="outline" className={base} onClick={() => navigate('/cart')}>
        <Check className="size-4" aria-hidden="true" />
        In your cart — view cart
      </Button>);

  }
  return (
    <Button
      className={base}
      onClick={() => {
        const result = add(artwork);
        if (result === 'added') {
          toast.success(`“${artwork.title}” added to your cart`, {
            action: { label: 'View cart', onClick: () => navigate('/cart') }
          });
        } else if (result === 'duplicate') {
          toast.info('This original is already in your cart.');
        } else {
          toast.error('This artwork is no longer available.');
        }
      }}>
      
      <ShoppingBag className="size-4" aria-hidden="true" />
      Add to cart
    </Button>);

}