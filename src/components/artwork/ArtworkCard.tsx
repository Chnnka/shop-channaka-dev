import React from 'react';
import { Link } from 'react-router-dom';
import type { Artwork } from '../../types/artwork';
import { getCategory } from '../../utils/categories';
import { cn } from '../../utils/cn';
import { ArtworkPrice } from './ArtworkPrice';
import { AvailabilityBadge } from './AvailabilityBadge';

interface ArtworkCardProps {
  artwork: Artwork;
  priority?: boolean;
  className?: string;
}

/**
 * Editorial card: the artwork sits on a cream "mat" and is never cropped —
 * every piece keeps its true proportions inside a consistent frame.
 */
export function ArtworkCard({ artwork, priority = false, className }: ArtworkCardProps) {
  const [main, secondary] = artwork.images;
  const category = getCategory(artwork.category);
  const isRoomShot = main?.kind === 'room';

  return (
    <article className={cn('group', className)}>
      <Link
        to={`/artwork/${artwork.slug}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        aria-label={`${artwork.title}, ${category.singular}`}>
        
        <div className="relative aspect-[4/5] overflow-hidden bg-sand">
          {main &&
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center transition-opacity duration-700',
              isRoomShot ? 'p-0' : 'p-[11%]',
              secondary && 'group-hover:opacity-0'
            )}>
            
              <img
              src={main.src}
              alt={main.alt}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              className={cn(
                'transition-transform duration-700 ease-out group-hover:scale-[1.02]',
                isRoomShot ?
                'h-full w-full object-cover' :
                'max-h-full max-w-full object-contain shadow-[0_14px_30px_-16px_rgba(31,29,26,0.45)]'
              )} />
            
            </div>
          }
          {secondary &&
          <img
            src={secondary.src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

          }
          {artwork.availability !== 'available' &&
          <AvailabilityBadge availability={artwork.availability} variant="overlay" className="absolute left-3 top-3" />
          }
          <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-2 whitespace-nowrap bg-ivory px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
            View artwork
          </span>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-serif text-[22px] leading-tight text-foreground">{artwork.title}</h3>
            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{category.singular}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 pt-1 text-right">
            <ArtworkPrice artwork={artwork} className="text-sm" />
            {artwork.availability === 'available' && <AvailabilityBadge availability="available" />}
          </div>
        </div>
      </Link>
    </article>);

}