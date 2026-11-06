import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Fingerprint, Frame, ShieldCheck, Truck } from 'lucide-react';
import { AddToCartButton } from '../components/artwork/AddToCartButton';
import { ArtworkGrid } from '../components/artwork/ArtworkGrid';
import { ArtworkImageGallery } from '../components/artwork/ArtworkImageGallery';
import { ArtworkPrice } from '../components/artwork/ArtworkPrice';
import { ArtworkSpecs } from '../components/artwork/ArtworkSpecs';
import { AvailabilityBadge } from '../components/artwork/AvailabilityBadge';
import { ApiError } from '../api/apiClient';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { SectionHeading } from '../components/common/SectionHeading';
import { TextLink } from '../components/common/TextLink';
import { Skeleton } from '../components/ui/Skeleton';
import { usePageMeta } from '../hooks/usePageMeta';
import { usePublicArtwork } from '../hooks/usePublicArtwork';
import { usePublicCatalog } from '../hooks/usePublicCatalog';
import type { Artwork } from '../types/artwork';
import { artworksInCollection, isPublic } from '../utils/artworkFilters';
import { getCategory } from '../utils/categories';
import { formatDimensionsShort, formatWeight } from '../utils/format';

const availabilityMessage: Record<Artwork['availability'], string> = {
  available: 'One of a kind — this is the only one.',
  reserved: 'This piece is currently reserved for a buyer. It may become available again — get in touch to be notified.',
  sold: 'This original has found a home. Ask about similar work or a commission.',
  archived: ''
};

export function ArtworkDetail() {
  const { slug } = useParams();
  const { data: artwork, isPending, isError, error, refetch } = usePublicArtwork(slug);
  // Only for the "more like this" and collection sections; they stay empty until it loads
  const { artworks, collections } = usePublicCatalog();

  usePageMeta({
    title: artwork ? artwork.seo?.title ?? artwork.title : 'Artwork',
    description: artwork?.seo?.description ?? artwork?.description,
    image: artwork?.images[0]?.src
  });

  if (slug && isPending) return <DetailSkeleton />;

  if (isError && !(error instanceof ApiError && error.status === 404)) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-32">
        <ErrorMessage title="Couldn’t load this artwork" message={error.message} onRetry={() => void refetch()} />
      </div>);

  }

  if (!artwork) {
    return (
      <EmptyState
        icon={Frame}
        title="Artwork not found"
        description="This artwork may have been removed or the link is incorrect."
        action={<TextLink to="/gallery">Back to the gallery</TextLink>}
        className="py-32" />);


  }

  const category = getCategory(artwork.category);
  const sizeLine = [formatDimensionsShort(artwork.dimensions), formatWeight(artwork.weight)].filter(Boolean).join(' · ');
  const isSiteSpecific = artwork.details.installation === 'Painted directly on wall';
  const related = artworks.
  filter((a) => isPublic(a) && a.id !== artwork.id && a.category === artwork.category).
  slice(0, 4);
  const collection = collections.find((c) => c.published && artwork.collectionIds.includes(c.id));
  const fromCollection = collection ?
  artworksInCollection(artworks, collection.id).
  filter((a) => a.id !== artwork.id && !related.some((r) => r.id === a.id)).
  slice(0, 4) :
  [];

  return (
    <article>
      <div className="mx-auto max-w-[1440px] px-5 pt-8 md:px-10">
        <Breadcrumbs
          items={[
          { label: 'Gallery', to: '/gallery' },
          { label: category.label, to: `/gallery?category=${category.id}` },
          { label: artwork.title }]
          } />
        
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ArtworkImageGallery images={artwork.images} title={artwork.title} />
          </div>

          <div className="pb-10 lg:py-6">
            <p className="text-[11px] uppercase tracking-[0.24em] text-earth">{category.singular}</p>
            <h1 className="mt-4 font-serif text-5xl font-normal leading-[1.02] md:text-6xl">{artwork.title}</h1>
            {(artwork.medium || artwork.year) &&
            <p className="mt-4 text-[15px] text-muted-foreground">
                {[artwork.medium, artwork.year].filter(Boolean).join(', ')}
              </p>
            }
            {sizeLine && <p className="mt-1 text-[15px] text-muted-foreground">{sizeLine}</p>}

            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
              <ArtworkPrice artwork={artwork} className="font-serif text-3xl" />
              <AvailabilityBadge availability={artwork.availability} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{availabilityMessage[artwork.availability]}</p>

            <div className="mt-6 flex flex-col gap-3">
              <AddToCartButton artwork={artwork} />
              <Link
                to={`/contact?artwork=${artwork.slug}`}
                className="flex h-12 items-center justify-center rounded-sm border border-border text-[12px] uppercase tracking-[0.2em] transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                
                {artwork.availability === 'available' ? 'Ask about this piece' : 'Enquire about similar work'}
              </Link>
            </div>

            {isSiteSpecific &&
            <p className="mt-4 rounded-sm bg-sand p-4 text-sm text-muted-foreground">
                This mural was painted directly on site and is shown as commissioned work. Wall commissions are welcome —
                get in touch to discuss a space.
              </p>
            }

            <ul className="mt-8 space-y-4 border-y border-border py-6 text-sm">
              <li className="flex gap-3">
                <Fingerprint className="mt-0.5 size-4 shrink-0 text-earth" aria-hidden="true" />
                <span>Original, one-of-a-kind artwork made by hand — not a print.</span>
              </li>
              <li className="flex gap-3">
                <Truck className="mt-0.5 size-4 shrink-0 text-earth" aria-hidden="true" />
                <span>
                  Insured shipping within Sri Lanka and internationally.{' '}
                  <Link to="/info/shipping" className="underline underline-offset-4 hover:text-earth">
                    Shipping details
                  </Link>
                </span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-earth" aria-hidden="true" />
                <span>Secure checkout — card details are handled only by our payment provider.</span>
              </li>
            </ul>

            {artwork.description &&
            <div className="mt-8">
                <h2 className="sr-only">Description</h2>
                <p className="text-[15px] leading-relaxed text-[#4a443d]">{artwork.description}</p>
              </div>
            }
          </div>
        </div>
      </div>

      <section aria-labelledby="details-heading" className="mt-16 border-t border-border bg-sand py-20 md:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-earth">About the work</p>
            <h2 id="details-heading" className="font-serif text-4xl font-normal leading-tight">
              {artwork.story ? 'The story behind it' : 'Medium & technique'}
            </h2>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#4a443d]">
              {artwork.story ?? category.description}
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-[11px] uppercase tracking-[0.28em] text-earth">Details</h3>
            <ArtworkSpecs artwork={artwork} />
          </div>
        </div>
      </section>

      {related.length > 0 &&
      <section aria-labelledby="related-heading" className="py-20 md:py-28">
          <div className="mx-auto max-w-[1440px] px-5 md:px-10">
            <SectionHeading
            title={`More ${category.label.toLowerCase()}`}
            action={<TextLink to={`/gallery?category=${category.id}`}>View all</TextLink>} />
          
            <ArtworkGrid artworks={related} className="mt-12" />
          </div>
        </section>
      }

      {collection && fromCollection.length > 0 &&
      <section aria-labelledby="collection-heading" className="border-t border-border py-20 md:py-28">
          <div className="mx-auto max-w-[1440px] px-5 md:px-10">
            <SectionHeading
            eyebrow="From the collection"
            title={collection.title}
            action={<TextLink to={`/collections/${collection.slug}`}>View collection</TextLink>} />
          
            <ArtworkGrid artworks={fromCollection} className="mt-12" />
          </div>
        </section>
      }
    </article>);

}

function DetailSkeleton() {
  return (
    <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pt-16 md:px-10 lg:grid-cols-[1.35fr_1fr]" aria-busy="true">
      <Skeleton className="aspect-[4/5] rounded-none bg-sand lg:aspect-auto lg:h-[80vh]" />
      <div className="space-y-4 pt-6">
        <Skeleton className="h-3 w-32 bg-sand" />
        <Skeleton className="h-14 w-4/5 bg-sand" />
        <Skeleton className="h-4 w-1/2 bg-sand" />
        <Skeleton className="mt-10 h-10 w-40 bg-sand" />
        <Skeleton className="h-12 w-full bg-sand" />
      </div>
    </div>);

}