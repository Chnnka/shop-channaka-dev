import React from 'react';
import { usePublicCatalog } from '../../hooks/usePublicCatalog';
import { artworksInCollection, publishedCollections } from '../../utils/artworkFilters';
import { CollectionCard } from '../collection/CollectionCard';
import { SectionHeading } from '../common/SectionHeading';
import { TextLink } from '../common/TextLink';
import { Skeleton } from '../ui/Skeleton';

export function CollectionsShowcase() {
  const { collections, artworks, status } = usePublicCatalog();
  const list = publishedCollections(collections).slice(0, 3);
  const [first, ...rest] = list;

  return (
    <section aria-labelledby="collections-heading" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading
          eyebrow="Curated collections"
          title="Themes that keep returning"
          action={<TextLink to="/collections">All collections</TextLink>} />
        
        {status === 'loading' ?
        <div className="mt-14 grid gap-10 lg:grid-cols-12">
            <Skeleton className="aspect-[4/5] bg-sand lg:col-span-7" />
            <Skeleton className="aspect-[4/5] bg-sand lg:col-span-5" />
          </div> :

        first &&
        <div className="mt-14 grid gap-x-10 gap-y-16 lg:grid-cols-12">
              <CollectionCard
            collection={first}
            count={artworksInCollection(artworks, first.id).length}
            variant="portrait"
            className="lg:col-span-7" />
          
              <div className="flex flex-col gap-16 lg:col-span-5 lg:pt-24">
                {rest.map((c) =>
            <CollectionCard
              key={c.id}
              collection={c}
              count={artworksInCollection(artworks, c.id).length}
              variant="landscape" />

            )}
              </div>
            </div>

        }
      </div>
    </section>);

}