import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { usePrototype } from '../../contexts/PrototypeContext';
import { cn } from '../../utils/cn';
import { ScrollToTop } from './ScrollToTop';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function PublicLayout() {
  const { pathname } = useLocation();
  const { transparentHomeHeader } = usePrototype();
  const overlay = pathname === '/' && transparentHomeHeader;
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <ScrollToTop />
      <SiteHeader />
      <main id="main" className={cn('flex-1', !overlay && 'pt-[72px] lg:pt-20')}>
        <Outlet />
      </main>
      <SiteFooter />
    </div>);

}