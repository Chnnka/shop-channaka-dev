import { useParams } from 'react-router-dom';
import { Frame } from 'lucide-react';
import { ApiError } from '../../api/apiClient';
import { ArtworkForm } from '../../components/admin/ArtworkForm/ArtworkForm';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { TextLink } from '../../components/common/TextLink';
import { Skeleton } from '../../components/ui/Skeleton';
import { useAdminArtwork } from '../../hooks/admin/useAdminArtwork';
import { usePageMeta } from '../../hooks/usePageMeta';

export function AdminArtworkEditor() {
  const { id } = useParams();
  const isNew = !id;
  // Only editing needs the existing artwork; adding a new one can show the form straight away
  const { data: artwork, isPending, isError, error, refetch } = useAdminArtwork(id);
  usePageMeta({ title: isNew ? 'Add artwork · Admin' : `Edit ${artwork?.title ?? 'artwork'} · Admin` });

  if (isNew) return <ArtworkForm key="new" />;

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72 bg-sand" />
        <Skeleton className="h-80 w-full bg-sand" />
      </div>);

  }
  if (isError && error instanceof ApiError && error.status === 404) {
    return (
      <EmptyState
        icon={Frame}
        title="Artwork not found"
        description="It may have been deleted."
        action={<TextLink to="/admin/artworks">Back to artworks</TextLink>} />);


  }
  if (isError) {
    return <ErrorMessage title="Couldn’t load this artwork" message={error.message} onRetry={() => void refetch()} />;
  }
  return <ArtworkForm key={artwork.id} artwork={artwork} />;
}
