import React from 'react';
import { CollectionCard } from '../components/collection/CollectionCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Skeleton } from '../components/ui/Skeleton';
import { usePublicCatalog } from '../hooks/usePublicCatalog';
import { usePageMeta } from '../hooks/usePageMeta';
import { artworksInCollection, publishedCollections } from '../utils/artworkFilters';
import { cn } from '../utils/cn';

/** Rhythm of layouts so the page reads editorially rather than as a uniform grid. */
const layout = [
{ span: 'lg:col-span-12', variant: 'feature' as const },
{ span: 'lg:col-span-5', variant: 'portrait' as const },
{ span: 'lg:col-span-6 lg:col-start-7 lg:pt-32', variant: 'landscape' as const },
{ span: 'lg:col-span-7', variant: 'landscape' as const },
{ span: 'lg:col-span-4 lg:col-start-9 lg:pt-20', variant: 'portrait' as const }];


export function Collections() {
  const { collections, artworks, status, reload } = usePublicCatalog();
  usePageMeta({
    title: 'Collections',
    description: 'Curated groupings of original artworks by theme — wildlife, landscapes, birds, fantasy and texture.'
  });
  const list = publishedCollections(collections);

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
      <header className="pb-16 pt-10 md:pt-14">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Collections' }]} />
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <h1 className="font-serif text-5xl font-normal leading-none md:text-7xl lg:col-span-6">Collections</h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground lg:col-span-5 lg:col-start-8 lg:pt-4">
            Groupings of work that share a subject, a mood or a way of making. A gentle way into the gallery if you’re not
            sure where to begin.
          </p>
        </div>
      </header>

      {status === 'error' && <ErrorMessage message="We couldn’t load collections." onRetry={reload} />}
      {status === 'loading' &&
      <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-[16/10] bg-sand lg:col-span-2" />
          <Skeleton className="aspect-[4/5] bg-sand" />
          <Skeleton className="aspect-[4/3] bg-sand" />
        </div>
      }
      {status === 'ready' &&
      <div className="grid gap-x-10 gap-y-20 lg:grid-cols-12">
          {list.map((c, i) => {
          const l = layout[i % layout.length];
          return (
            <CollectionCard
              key={c.id}
              collection={c}
              count={artworksInCollection(artworks, c.id).length}
              variant={l.variant}
              className={cn(l.span)} />);


        })}
        </div>
      }
    </div>);

}