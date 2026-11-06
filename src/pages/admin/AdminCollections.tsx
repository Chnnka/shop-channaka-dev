import React, { useState } from 'react';
import { ArrowDown, ArrowUp, FolderOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { adminIconButton, adminPanel } from '../../components/admin/adminStyles';
import { CollectionEditorDialog } from '../../components/admin/CollectionEditorDialog';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { Switch } from '../../components/ui/Switch';
import { useAdminArtworks } from '../../hooks/admin/useAdminArtworks';
import { useAdminCollections } from '../../hooks/admin/useAdminCollections';
import {
  useDeleteCollection,
  useMoveCollection,
  useSetCollectionPublished } from
'../../hooks/admin/useCollectionMutations';
import { usePageMeta } from '../../hooks/usePageMeta';
import type { Collection } from '../../types/artwork';
import { cn } from '../../utils/cn';

export function AdminCollections() {
  usePageMeta({ title: 'Collections · Admin' });
  const collectionsQuery = useAdminCollections();
  const artworksQuery = useAdminArtworks();
  const collections = collectionsQuery.data ?? [];
  const artworks = artworksQuery.data ?? [];
  const loadError = collectionsQuery.error ?? artworksQuery.error;
  const status = loadError ? 'error' : collectionsQuery.isPending || artworksQuery.isPending ? 'loading' : 'ready';
  const reload = () => {
    void collectionsQuery.refetch();
    void artworksQuery.refetch();
  };
  const moveCollection = useMoveCollection();
  const setPublished = useSetCollectionPublished();
  const deleteCollection = useDeleteCollection();
  const busy = moveCollection.isPending || setPublished.isPending || deleteCollection.isPending;
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [toDelete, setToDelete] = useState<Collection | null>(null);
  const sorted = [...collections].sort((a, b) => a.order - b.order);

  const move = (c: Collection, direction: -1 | 1) =>
  moveCollection.mutate(
    { id: c.id, direction },
    { onError: (error) => toast.error(`Couldn’t move “${c.title}”: ${error.message}`) }
  );

  const openEditor = (c: Collection | null) => {
    setEditing(c);
    setEditorOpen(true);
  };

  return (
    <div>
      <AdminPageHeader
        title="Collections"
        description="Create, reorder and publish curated groupings of artwork."
        actions={
        <Button className="h-10 rounded-sm" onClick={() => openEditor(null)}>
            <Plus className="size-4" aria-hidden="true" />
            New collection
          </Button>
        } />
      
      <div className={adminPanel}>
        {status === 'error' &&
        <ErrorMessage className="m-4" title="Couldn’t load collections" message={loadError?.message ?? ''} onRetry={reload} />
        }
        {status === 'loading' &&
        <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, i) =>
          <Skeleton key={i} className="h-20 w-full bg-sand" />
          )}
          </div>
        }
        {status === 'ready' && sorted.length === 0 &&
        <EmptyState
          icon={FolderOpen}
          title="No collections yet"
          description="Create your first collection to group related artworks."
          action={<Button onClick={() => openEditor(null)}>New collection</Button>} />

        }
        {status === 'ready' && sorted.length > 0 &&
        <ol className="divide-y divide-border">
            {sorted.map((c, i) => {
            const count = artworks.filter((a) => a.collectionIds.includes(c.id)).length;
            return (
              <li key={c.id} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
                  <span className="w-6 text-center text-sm tabular-nums text-muted-foreground">{i + 1}</span>
                  <img src={c.coverImage} alt="" className="size-16 shrink-0 bg-sand object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{c.title}</p>
                    <p className="truncate text-sm text-muted-foreground">{c.description}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {count} {count === 1 ? 'artwork' : 'artworks'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                    id={`pub-${c.id}`}
                    checked={c.published}
                    disabled={busy}
                    onCheckedChange={(v) =>
                    setPublished.mutate(
                      { id: c.id, published: v },
                      {
                        onSuccess: () => toast.success(v ? `“${c.title}” published` : `“${c.title}” unpublished`),
                        onError: (error) => toast.error(`Couldn’t change “${c.title}”: ${error.message}`)
                      }
                    )
                    } />
                  
                    <label htmlFor={`pub-${c.id}`} className={cn('w-20 text-xs', c.published ? 'text-foreground' : 'text-muted-foreground')}>
                      {c.published ? 'Published' : 'Hidden'}
                    </label>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button type="button" className={adminIconButton} disabled={busy || i === 0} onClick={() => move(c, -1)} aria-label={`Move ${c.title} up`}>
                      <ArrowUp className="size-4" />
                    </button>
                    <button
                    type="button"
                    className={adminIconButton}
                    disabled={busy || i === sorted.length - 1}
                    onClick={() => move(c, 1)}
                    aria-label={`Move ${c.title} down`}>
                    
                      <ArrowDown className="size-4" />
                    </button>
                    <button type="button" className={adminIconButton} onClick={() => openEditor(c)} aria-label={`Edit ${c.title}`}>
                      <Pencil className="size-4" />
                    </button>
                    <button
                    type="button"
                    className={cn(adminIconButton, 'hover:text-destructive')}
                    onClick={() => setToDelete(c)}
                    aria-label={`Delete ${c.title}`}>
                    
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </li>);

          })}
          </ol>
        }
      </div>

      <CollectionEditorDialog open={editorOpen} collection={editing} onClose={() => setEditorOpen(false)} />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete this collection?"
        description={`“${toDelete?.title ?? ''}” will be removed. Its artworks stay in the catalogue.`}
        confirmLabel="Delete collection"
        destructive
        onConfirm={() => {
          if (!toDelete) return;
          const c = toDelete;
          setToDelete(null);
          deleteCollection.mutate(c.id, {
            onSuccess: () => toast.success(`“${c.title}” deleted`),
            onError: (error) => toast.error(`Couldn’t delete “${c.title}”: ${error.message}`)
          });
        }} />
      
    </div>);

}