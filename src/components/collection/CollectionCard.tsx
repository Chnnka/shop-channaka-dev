import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Collection } from '../../types/artwork';
import { cn } from '../../utils/cn';

interface CollectionCardProps {
  collection: Collection;
  count?: number;
  variant?: 'portrait' | 'landscape' | 'feature';
  className?: string;
}

const ratio = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[4/3]',
  feature: 'aspect-[4/5] md:aspect-[16/10]'
};

export function CollectionCard({ collection, count, variant = 'portrait', className }: CollectionCardProps) {
  return (
    <article className={cn('group', className)}>
      <Link
        to={`/collections/${collection.slug}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
        
        <div className={cn('relative overflow-hidden bg-sand', ratio[variant])}>
          <img
            src={collection.coverImage}
            alt={collection.coverAlt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]" />
          
        </div>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            {count !== undefined &&
            <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-earth">
                {count} {count === 1 ? 'artwork' : 'artworks'}
              </p>
            }
            <h3 className={cn('font-serif leading-tight', variant === 'feature' ? 'text-4xl' : 'text-[28px]')}>
              {collection.title}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{collection.description}</p>
          </div>
          <ArrowRight
            className="mt-2 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground"
            aria-hidden="true" />
          
        </div>
      </Link>
    </article>);

}