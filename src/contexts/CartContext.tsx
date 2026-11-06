import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { currencyConfig } from '../data/site';
import type { Artwork } from '../types/artwork';
import type { CartLine, CurrencyCode } from '../types/commerce';
import { getArtworkPrice } from '../utils/pricing';
import { usePublicCatalog } from '../hooks/usePublicCatalog';

const STORAGE_KEY = 'kala-studio-cart-v1';

export type CartIssue = 'unavailable' | 'missing' | 'no-price' | null;

export interface CartItem {
  line: CartLine;
  artwork: Artwork | null;
  price: number | null;
  issue: CartIssue;
}

export type AddResult = 'added' | 'duplicate' | 'unavailable';

interface CartContextValue {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  items: CartItem[];
  count: number;
  subtotal: number;
  hasIssues: boolean;
  isInCart: (artworkId: string) => boolean;
  add: (artwork: Artwork) => AddResult;
  remove: (artworkId: string) => void;
  clear: () => void;
}

interface StoredCart {
  currency: CurrencyCode;
  lines: CartLine[];
}

function readStored(): StoredCart {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredCart;
      if (Array.isArray(parsed.lines) && currencyConfig.supported.includes(parsed.currency)) return parsed;
    }
  } catch {

    // ignore corrupt storage
  }return { currency: currencyConfig.default, lines: [] };
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: {children: React.ReactNode;}) {
  const { artworks, status } = usePublicCatalog();
  const [stored, setStored] = useState<StoredCart>(readStored);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {

      // storage may be unavailable (private mode)
    }}, [stored]);

  const items = useMemo<CartItem[]>(
    () =>
    stored.lines.map((line) => {
      const artwork = artworks.find((a) => a.id === line.artworkId) ?? null;
      if (!artwork) return { line, artwork, price: null, issue: status === 'ready' ? 'missing' : null };
      const price = getArtworkPrice(artwork, stored.currency);
      const issue: CartIssue =
      artwork.availability !== 'available' ? 'unavailable' : price == null ? 'no-price' : null;
      return { line, artwork, price, issue };
    }),
    [stored, artworks, status]
  );

  const isInCart = useCallback((id: string) => stored.lines.some((l) => l.artworkId === id), [stored.lines]);

  const add = useCallback(
    (artwork: Artwork): AddResult => {
      if (artwork.availability !== 'available') return 'unavailable';
      if (stored.lines.some((l) => l.artworkId === artwork.id)) return 'duplicate';
      setStored((prev) =>
      prev.lines.some((l) => l.artworkId === artwork.id) ?
      prev :
      { ...prev, lines: [...prev.lines, { artworkId: artwork.id, addedAt: new Date().toISOString() }] }
      );
      return 'added';
    },
    [stored.lines]
  );

  const remove = useCallback((id: string) => {
    setStored((prev) => ({ ...prev, lines: prev.lines.filter((l) => l.artworkId !== id) }));
  }, []);

  const clear = useCallback(() => setStored((prev) => ({ ...prev, lines: [] })), []);
  const setCurrency = useCallback((currency: CurrencyCode) => setStored((prev) => ({ ...prev, currency })), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, i) => sum + (i.issue ? 0 : i.price ?? 0), 0);
    return {
      currency: stored.currency,
      setCurrency,
      items,
      count: stored.lines.length,
      subtotal,
      hasIssues: items.some((i) => i.issue !== null),
      isInCart,
      add,
      remove,
      clear
    };
  }, [items, stored, setCurrency, isInCart, add, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}