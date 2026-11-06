import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, LoaderCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '../../api/apiClient';
import { useAdminArtworks } from '../../hooks/admin/useAdminArtworks';
import { useAdminCollections } from '../../hooks/admin/useAdminCollections';
import { useSaveCollection } from '../../hooks/admin/useCollectionMutations';
import { useUploadImage } from '../../hooks/admin/useUploadImage';
import type { Collection } from '../../types/artwork';
import { slugify } from '../../utils/categories';
import { cn } from '../../utils/cn';
import { describedBy, FormField } from '../common/FormField';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Switch } from '../ui/Switch';
import { Textarea } from '../ui/Textarea';

interface Props {
  open: boolean;
  collection: Collection | null;
  onClose: () => void;
}

export function CollectionEditorDialog({ open, collection, onClose }: Props) {
  const { data: artworks = [] } = useAdminArtworks();
  const { data: collections = [] } = useAdminCollections();
  const saveCollection = useSaveCollection();
  const uploadImage = useUploadImage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');
  const [published, setPublished] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const saving = saveCollection.isPending;
  const uploading = uploadImage.isPending;
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setTitle(collection?.title ?? '');
    setDescription(collection?.description ?? '');
    setCover(collection?.coverImage ?? '');
    setPublished(collection?.published ?? true);
    setSelected(collection ? artworks.filter((a) => a.collectionIds.includes(collection.id)).map((a) => a.id) : []);
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, collection]);

  const coverOptions = useMemo(() => {
    const srcs = artworks.flatMap((a) => a.images.slice(0, 1).map((i) => ({ src: i.src, alt: a.title })));
    if (cover && !srcs.some((s) => s.src === cover)) srcs.unshift({ src: cover, alt: 'Uploaded cover' });
    return srcs;
  }, [artworks, cover]);

  const save = () => {
    const next: Record<string, string> = {};
    if (title.trim().length < 2) next.title = 'Enter a collection name';
    if (description.trim().length < 10) next.description = 'Add a short description (at least 10 characters)';
    if (!cover) next.cover = 'Choose or upload a cover image';
    const slug = slugify(title);
    if (!next.title && collections.some((c) => c.slug === slug && c.id !== collection?.id)) next.title = 'A collection with this name already exists';
    setErrors(next);
    if (Object.keys(next).length) return;

    const coverAlt = coverOptions.find((o) => o.src === cover)?.alt ?? title;
    // The server generates the id and position for a new collection, and keeps them on update
    saveCollection.mutate(
      {
        id: collection?.id,
        payload: {
          collection: {
            slug,
            title: title.trim(),
            description: description.trim(),
            coverImage: cover,
            coverAlt: `Cover image: ${coverAlt}`,
            published
          },
          artworkIds: selected
        }
      },
      {
        onSuccess: () => {
          toast.success(collection ? 'Collection saved' : 'Collection created');
          onClose();
        },
        onError: (error) => {
          if (error instanceof ApiError && error.status === 409) {
            setErrors({ title: 'A collection with this name already exists' });
            return;
          }
          toast.error(`Could not save the collection: ${error.message}`);
        }
      }
    );
  };

  const uploadCover = (file: File) =>
  uploadImage.mutate(file, {
    onSuccess: (src) => {
      setCover(src);
      setErrors((e) => ({ ...e, cover: '' }));
    },
    onError: (error) => toast.error(`Upload failed: ${error.message}`)
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-normal">{collection ? 'Edit collection' : 'New collection'}</DialogTitle>
          <DialogDescription>Group artworks by theme, subject or technique.</DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <FormField id="ce-title" label="Name" required error={errors.title} hint={title ? `/collections/${slugify(title)}` : undefined}>
            <Input
              id="ce-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={describedBy('ce-title', errors.title, title ? 'x' : undefined)}
              className="h-10" />
            
          </FormField>
          <FormField id="ce-description" label="Description" required error={errors.description}>
            <Textarea
              id="ce-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={describedBy('ce-description', errors.description)} />
            
          </FormField>
          <fieldset>
            <legend className="mb-2 text-[13px] font-medium">
              Cover image <span className="text-destructive">*</span>
            </legend>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {coverOptions.map((o) =>
              <button
                key={o.src}
                type="button"
                onClick={() => setCover(o.src)}
                aria-pressed={cover === o.src}
                aria-label={`Use ${o.alt} as cover`}
                className={cn(
                  'relative aspect-square overflow-hidden bg-sand ring-2 ring-offset-1 focus-visible:outline-2 focus-visible:outline-ring',
                  cover === o.src ? 'ring-foreground' : 'ring-transparent'
                )}>
                
                  <img src={o.src} alt="" className="h-full w-full object-cover" />
                  {cover === o.src &&
                <span className="absolute right-1 top-1 rounded-full bg-foreground p-0.5 text-ivory">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                }
                </button>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex aspect-square flex-col items-center justify-center gap-1 border border-dashed border-input text-xs text-muted-foreground hover:border-foreground">

                {uploading ?
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> :
                <Upload className="size-4" aria-hidden="true" />
                }
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.type.startsWith('image/')) uploadCover(file);
                  e.target.value = '';
                }} />
              
            </div>
            {errors.cover &&
            <p className="mt-2 text-xs text-destructive" role="alert">
                {errors.cover}
              </p>
            }
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-[13px] font-medium">Artworks ({selected.length} selected)</legend>
            <ul className="max-h-56 divide-y divide-border overflow-y-auto rounded-sm border border-border">
              {artworks.map((a) => {
                const id = `ce-art-${a.id}`;
                return (
                  <li key={a.id} className="flex items-center gap-3 px-3 py-2">
                    <Checkbox
                      id={id}
                      checked={selected.includes(a.id)}
                      onCheckedChange={(v) => setSelected((s) => v === true ? [...s, a.id] : s.filter((x) => x !== a.id))} />
                    
                    <span className="flex size-9 shrink-0 items-center justify-center bg-sand p-0.5">
                      <img src={a.images[0]?.src} alt="" className="max-h-full max-w-full object-contain" />
                    </span>
                    <label htmlFor={id} className="flex-1 text-sm">
                      {a.title}
                    </label>
                  </li>);

              })}
            </ul>
          </fieldset>
          <div className="flex items-center justify-between rounded-sm border border-border p-3">
            <label htmlFor="ce-published" className="text-sm">
              Published
              <span className="block text-xs text-muted-foreground">Unpublished collections are hidden from the site.</span>
            </label>
            <Switch id="ce-published" checked={published} onCheckedChange={setPublished} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving || uploading}>
            {saving && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
            {collection ? 'Save collection' : 'Create collection'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);

}