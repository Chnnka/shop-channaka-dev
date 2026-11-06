import React from 'react';
import { NavLink } from 'react-router-dom';
import { categories } from '../../data/categories';
import { primaryNav, site } from '../../data/site';
import { cn } from '../../utils/cn';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/Sheet';
import { CurrencySwitcher } from './CurrencySwitcher';

export function MobileNav({ open, onOpenChange }: {open: boolean;onOpenChange: (open: boolean) => void;}) {
  const close = () => onOpenChange(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-sm overflow-y-auto bg-ivory p-0">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="font-serif text-2xl font-normal">{site.name}</SheetTitle>
          <SheetDescription className="text-xs">{site.tagline}</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="px-6 py-6">
          <ul className="flex flex-col">
            {primaryNav.map((item) =>
            <li key={item.to}>
                <NavLink
                to={item.to}
                end={item.to === '/'}
                onClick={close}
                className={({ isActive }) =>
                cn(
                  'block border-b border-border py-4 font-serif text-3xl transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )
                }>
                
                  {item.label}
                </NavLink>
              </li>
            )}
          </ul>
          <p className="mb-3 mt-8 text-[11px] uppercase tracking-[0.2em] text-earth">Browse by category</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
            {categories.map((c) =>
            <li key={c.id}>
                <NavLink to={`/gallery?category=${c.id}`} onClick={close} className="text-muted-foreground hover:text-foreground">
                  {c.label}
                </NavLink>
              </li>
            )}
          </ul>
          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <span className="text-xs text-muted-foreground">Currency</span>
            <CurrencySwitcher />
          </div>
        </nav>
      </SheetContent>
    </Sheet>);

}