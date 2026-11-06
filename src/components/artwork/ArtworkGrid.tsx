import React from 'react';
import type { Artwork } from '../../types/artwork';
import { cn } from '../../utils/cn';
import { Skeleton } from '../ui/Skeleton';
import { ArtworkCard } from './ArtworkCard';

interface ArtworkGridProps {
  artworks: Artwork[];
  loading?: boolean;
  skeletonCount?: number;
  columns?: 3 | 4;
  className?: string;
}

const columnClass = {
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
};

export function ArtworkGrid({ artworks, loading = false, skeletonCount = 6, columns = 4, className }: ArtworkGridProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-x-8 gap-y-14', columnClass[columns], className)} aria-busy={loading}>
      {loading ?
      Array.from({ length: skeletonCount }).map((_, i) => <ArtworkCardSkeleton key={i} />) :
      artworks.map((a, i) => <ArtworkCard key={a.id} artwork={a} priority={i < 4} />)}
    </div>);

}

export function ArtworkCardSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="aspect-[4/5] w-full rounded-none bg-sand" />
      <div className="mt-4 flex justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 bg-sand" />
          <Skeleton className="h-3 w-1/3 bg-sand" />
        </div>
        <Skeleton className="h-4 w-16 bg-sand" />
      </div>
    </div>);

}