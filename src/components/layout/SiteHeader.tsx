import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { usePrototype } from '../../contexts/PrototypeContext';
import { primaryNav, site } from '../../data/site';
import { cn } from '../../utils/cn';
import { CurrencySwitcher } from './CurrencySwitcher';
import { MobileNav } from './MobileNav';
import { SearchDialog } from './SearchDialog';

export function SiteHeader() {
  const { pathname } = useLocation();
  const { count } = useCart();
  const { transparentHomeHeader } = usePrototype();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparent = pathname === '/' && transparentHomeHeader && !scrolled;
  const iconButton =
  'relative flex size-10 items-center justify-center rounded-sm transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-ring';

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 bg-foreground px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        
        Skip to content
      </a>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-500',
          transparent ? 'border-transparent bg-transparent' : 'border-border bg-ivory/95 backdrop-blur-sm'
        )}>
        
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-6 px-5 md:px-10 lg:h-20">
          <Link to="/" className="group flex flex-col leading-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            <span className="font-serif text-[26px] tracking-wide text-foreground">{site.name}</span>
            <span className="mt-1 hidden text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:block">
              {site.tagline}
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {primaryNav.map((item) =>
              <li key={item.to}>
                  <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                  cn(
                    'relative py-2 text-[12px] uppercase tracking-[0.18em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
                    "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-foreground after:transition-transform after:content-['']",
                    isActive ?
                    'text-foreground after:scale-x-100' :
                    'text-[#4a443d] after:scale-x-0 hover:text-foreground hover:after:scale-x-100'
                  )
                  }>
                  
                    {item.label}
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <CurrencySwitcher className="mr-3 hidden lg:flex" />
            <button type="button" className={iconButton} onClick={() => setSearchOpen(true)} aria-label="Search artworks">
              <Search className="size-[18px]" strokeWidth={1.5} />
            </button>
            <Link to="/cart" className={iconButton} aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
              <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
              {count > 0 &&
              <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] tabular-nums text-ivory">
                  {count}
                </span>
              }
            </Link>
            <button
              type="button"
              className={cn(iconButton, 'lg:hidden')}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}>
              
              <Menu className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileNav open={menuOpen} onOpenChange={setMenuOpen} />
    </>);

}