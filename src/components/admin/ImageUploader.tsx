import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, LoaderCircle, Star, Trash2 } from 'lucide-react';
import { useUploadImage } from '../../hooks/admin/useUploadImage';
import type { ArtworkImage, ImageKind } from '../../types/artwork';
import { cn } from '../../utils/cn';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { adminIconButton } from './adminStyles';

// Must match the backend's upload limits
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

interface PendingUpload {
  id: string;
  name: string;
  /** Local preview while the file uploads */
  previewUrl: string;
}
const kinds: {value: ImageKind;label: string;}[] = [
{ value: 'artwork', label: 'Full artwork' },
{ value: 'detail', label: 'Close-up detail' },
{ value: 'room', label: 'Room / display' },
{ value: 'process', label: 'Studio / process' }];


interface ImageUploaderProps {
  id: string;
  images: ArtworkImage[];
  onChange: (images: ArtworkImage[]) => void;
  error?: string;
  /** Called with true while any file is still uploading, so the form can wait before saving */
  onUploadingChange?: (uploading: boolean) => void;
}

/**
 * Each chosen file is uploaded to the server straight away; only uploaded images are added to
 * the list, with the server's src.
 */
export function ImageUploader({ id, images, onChange, error, onUploadingChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const uploadImage = useUploadImage();

  // Uploads finish one by one, so read the latest images instead of the ones from when they began
  const imagesRef = useRef(images);
  imagesRef.current = images;

  useEffect(() => {
    onUploadingChange?.(pending.length > 0);
  }, [pending.length, onUploadingChange]);

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const rejected: string[] = [];
    Array.from(files).forEach((file, i) => {
      if (!ACCEPTED_TYPES.includes(file.type)) return rejected.push(`${file.name} is not a JPG, PNG, WebP or AVIF image`);
      if (file.size > MAX_BYTES) return rejected.push(`${file.name} is larger than 5 MB`);

      const upload: PendingUpload = {
        id: `img-${Date.now().toString(36)}-${i}`,
        name: file.name,
        previewUrl: URL.createObjectURL(file)
      };
      setPending((p) => [...p, upload]);
      uploadImage
        .mutateAsync(file)
        .then((src) => {
          const current = imagesRef.current;
          onChange([
            ...current,
            { id: upload.id, src, alt: '', kind: current.length === 0 ? 'artwork' : 'detail' }
          ]);
        })
        .catch((err: unknown) => {
          const reason = err instanceof Error ? err.message : 'Upload failed';
          setUploadError((prev) => [prev, `${file.name}: ${reason}`].filter(Boolean).join('. '));
        })
        .finally(() => {
          URL.revokeObjectURL(upload.previewUrl);
          setPending((p) => p.filter((x) => x.id !== upload.id));
        });
    });
    setUploadError(rejected.length ? rejected.join('. ') : null);
  };

  const update = (index: number, patch: Partial<ArtworkImage>) =>
  onChange(images.map((img, i) => i === index ? { ...img, ...patch } : img));

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const makeMain = (index: number) => {
    const next = [...images];
    const [img] = next.splice(index, 1);
    onChange([img, ...next]);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          'flex flex-col items-center justify-center rounded-sm border border-dashed px-6 py-8 text-center transition-colors',
          dragging ? 'border-earth bg-sand' : error ? 'border-destructive' : 'border-input'
        )}>
        
        <ImagePlus className="size-6 text-earth" aria-hidden="true" strokeWidth={1.5} />
        <p className="mt-3 text-sm">Drag images here, or</p>
        <button
          id={id}
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 rounded-sm border border-border bg-card px-4 py-2 text-sm hover:border-foreground focus-visible:outline-2 focus-visible:outline-ring"
          aria-describedby={error ? `${id}-error` : `${id}-hint`}>
          
          Choose files
        </button>
        <p id={`${id}-hint`} className="mt-3 text-xs text-muted-foreground">
          JPG, PNG, WebP or AVIF, up to 5 MB each. The first image is the main image.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = '';
          }} />
        
      </div>
      {(error || uploadError) &&
      <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {uploadError ?? error}
        </p>
      }

      {images.length > 0 &&
      <ol className="space-y-3">
          {images.map((img, i) =>
        <li key={img.id} className="flex gap-4 rounded-sm border border-border p-3">
              <div className="relative flex size-24 shrink-0 items-center justify-center bg-sand p-1.5">
                <img src={img.src} alt="" className="max-h-full max-w-full object-contain" />
                {i === 0 &&
            <span className="absolute left-1 top-1 bg-foreground px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-ivory">
                    Main
                  </span>
            }
              </div>
              <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[1fr_170px]">
                <div>
                  <label htmlFor={`${img.id}-alt`} className="text-xs text-muted-foreground">
                    Alt text (describe the image)
                  </label>
                  <Input
                id={`${img.id}-alt`}
                value={img.alt}
                onChange={(e: ChangeEvent<HTMLInputElement>) => update(i, { alt: e.target.value })}
                placeholder="e.g. Pencil drawing of an elephant and calf"
                className="mt-1 h-9"
                aria-invalid={Boolean(error) && !img.alt.trim()} />
              
                </div>
                <div>
                  <span id={`${img.id}-kind`} className="text-xs text-muted-foreground">
                    Image type
                  </span>
                  <Select value={img.kind} onValueChange={(v: string) => update(i, { kind: v as ImageKind })}>
                    <SelectTrigger className="mt-1 h-9 w-full" aria-labelledby={`${img.id}-kind`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {kinds.map((k) =>
                  <SelectItem key={k.value} value={k.value}>
                          {k.label}
                        </SelectItem>
                  )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <button type="button" className={adminIconButton} onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move image ${i + 1} up`}>
                  <ArrowUp className="size-4" />
                </button>
                <button
              type="button"
              className={adminIconButton}
              onClick={() => move(i, 1)}
              disabled={i === images.length - 1}
              aria-label={`Move image ${i + 1} down`}>
              
                  <ArrowDown className="size-4" />
                </button>
                <button type="button" className={adminIconButton} onClick={() => makeMain(i)} disabled={i === 0} aria-label={`Set image ${i + 1} as main image`}>
                  <Star className="size-4" />
                </button>
                <button
              type="button"
              className={cn(adminIconButton, 'hover:text-destructive')}
              onClick={() => onChange(images.filter((_, idx) => idx !== i))}
              aria-label={`Remove image ${i + 1}`}>
              
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
        )}
        </ol>
      }

      {pending.length > 0 &&
      <ul className="space-y-3" aria-live="polite">
          {pending.map((p) =>
        <li key={p.id} className="flex items-center gap-4 rounded-sm border border-dashed border-border p-3">
              <div className="flex size-24 shrink-0 items-center justify-center bg-sand p-1.5 opacity-60">
                <img src={p.previewUrl} alt="" className="max-h-full max-w-full object-contain" />
              </div>
              <span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 shrink-0 animate-spin" aria-hidden="true" />
                <span className="truncate">Uploading {p.name}…</span>
              </span>
            </li>
        )}
        </ul>
      }
    </div>);

}