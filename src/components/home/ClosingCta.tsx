import React from 'react';
import { Link } from 'react-router-dom';
import { usePublicCatalog } from '../../hooks/usePublicCatalog';

export function ClosingCta() {
  const { artworks, status } = usePublicCatalog();
  const available = artworks.filter((a) => a.availability === 'available').length;
  return (
    <section aria-labelledby="cta-heading" className="bg-charcoal py-24 text-ivory md:py-32">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <p className="mb-6 text-[11px] uppercase tracking-[0.28em] text-[#c4ad8f]">
          {status === 'ready' ? `${available} originals currently available` : 'Originals available now'}
        </p>
        <h2 id="cta-heading" className="font-serif text-4xl font-normal leading-[1.08] md:text-6xl">
          Find a piece that belongs on your wall.
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-[#c9c1b5]">
          Every artwork ships carefully packed from Sri Lanka, within the island and internationally.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Link
            to="/gallery?availability=available"
            className="inline-flex h-12 items-center bg-ivory px-7 text-[12px] uppercase tracking-[0.2em] text-charcoal transition-colors hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory">
            
            Shop available work
          </Link>
          <Link
            to="/contact"
            className="border-b border-ivory pb-1 text-[12px] uppercase tracking-[0.2em] hover:border-[#c4ad8f] hover:text-[#c4ad8f]">
            
            Ask about a commission
          </Link>
        </div>
      </div>
    </section>);

}