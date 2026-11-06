import React from 'react';
import { useParams } from 'react-router-dom';
import { FolderOpen } from 'lucide-react';
import { ApiError } from '../api/apiClient';
import { ArtworkGrid } from '../components/artwork/ArtworkGrid';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { TextLink } from '../components/common/TextLink';
import { Skeleton } from '../components/ui/Skeleton';
import { useCart } from '../contexts/CartContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { usePublicCollection } from '../hooks/usePublicCollection';
import { sortArtworks } from '../utils/artworkFilters';

export function CollectionDetail() {
  const { slug } = useParams();
  const { data, isPending, isError, error, refetch } = usePublicCollection(slug);
  const { currency } = useCart();
  const collection = data?.collection;

  usePageMeta({
    title: collection?.title ?? 'Collection',
    description: collection?.description,
    image: collection?.coverImage
  });

  if (slug && isPending) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10">
        <Skeleton className="h-[50vh] w-full bg-sand" />
      </div>);

  }

  if (isError && !(error instanceof ApiError && error.status === 404)) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-32">
        <ErrorMessage title="Couldn’t load this collection" message={error.message} onRetry={() => void refetch()} />
      </div>);

  }

  if (!data || !collection) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="Collection not found"
        description="This collection may no longer be available."
        action={<TextLink to="/collections">All collections</TextLink>}
        className="py-32" />);


  }

  const items = sortArtworks(data.artworks, 'featured', currency);

  return (
    <div className="pb-28">
      <header className="mx-auto max-w-[1440px] px-5 pt-10 md:px-10 md:pt-14">
        <Breadcrumbs
          items={[{ label: 'Home', to: '/' }, { label: 'Collections', to: '/collections' }, { label: collection.title }]} />
        
        <div className="mt-8 grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-earth">
              Collection · {items.length} {items.length === 1 ? 'artwork' : 'artworks'}
            </p>
            <h1 className="font-serif text-5xl font-normal leading-[1.02] md:text-7xl">{collection.title}</h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">{collection.description}</p>
            <TextLink to={`/gallery?collection=${collection.id}`} className="mt-8">
              Filter in the gallery
            </TextLink>
          </div>
          <div className="aspect-[16/10] overflow-hidden bg-sand lg:col-span-7">
            <img src={collection.coverImage} alt={collection.coverAlt} className="h-full w-full object-cover" />
          </div>
        </div>
      </header>
      <section aria-label="Artworks in this collection" className="mx-auto mt-20 max-w-[1440px] border-t border-border px-5 pt-16 md:px-10">
        {items.length ?
        <ArtworkGrid artworks={items} /> :

        <EmptyState
          icon={FolderOpen}
          title="Nothing here yet"
          description="New work for this collection is on the easel."
          action={<TextLink to="/gallery">Browse the gallery</TextLink>} />

        }
      </section>
    </div>);

}