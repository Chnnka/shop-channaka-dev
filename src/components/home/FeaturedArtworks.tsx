import React from 'react';
import { usePublicCatalog } from '../../hooks/usePublicCatalog';
import { isPublic, sortArtworks } from '../../utils/artworkFilters';
import { useCart } from '../../contexts/CartContext';
import { ArtworkGrid } from '../artwork/ArtworkGrid';
import { ErrorMessage } from '../common/ErrorMessage';
import { SectionHeading } from '../common/SectionHeading';
import { TextLink } from '../common/TextLink';

export function FeaturedArtworks() {
  const { artworks, status, reload } = usePublicCatalog();
  const { currency } = useCart();
  const featured = sortArtworks(
    artworks.filter((a) => isPublic(a) && a.featured),
    'featured',
    currency
  ).slice(0, 8);

  return (
    <section aria-labelledby="featured-heading" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading
          eyebrow="Featured originals"
          title="Recently from the studio"
          description="A small selection of current work. Each piece is one of a kind — once it’s gone, it’s gone."
          action={<TextLink to="/gallery">View the full gallery</TextLink>} />
        
        <div className="mt-14">
          {status === 'error' ?
          <ErrorMessage message="We couldn’t load the artworks right now." onRetry={reload} /> :

          <ArtworkGrid artworks={featured} loading={status === 'loading'} skeletonCount={8} />
          }
        </div>
      </div>
    </section>);

}