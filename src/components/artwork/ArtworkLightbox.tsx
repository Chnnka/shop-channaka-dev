import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { ArtworkImage } from '../../types/artwork';
import { cn } from '../../utils/cn';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/Dialog';

interface ArtworkLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: ArtworkImage[];
  index: number;
  onIndexChange: (index: number) => void;
  title: string;
}

export function ArtworkLightbox({ open, onOpenChange, images, index, onIndexChange, title }: ArtworkLightboxProps) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const image = images[index];
  const many = images.length > 1;

  useEffect(() => setZoomed(false), [index, open]);

  const go = (dir: -1 | 1) => onIndexChange((index + dir + images.length) % images.length);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!many) return;
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin(`${(e.clientX - rect.left) / rect.width * 100}% ${(e.clientY - rect.top) / rect.height * 100}%`);
  };

  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onKeyDown={onKeyDown}
        className="flex h-[94vh] w-[96vw] max-w-[96vw] flex-col gap-0 rounded-none border-0 bg-charcoal p-0 text-ivory sm:max-w-[96vw]">
        
        <DialogTitle className="sr-only">{title} — image viewer</DialogTitle>
        <DialogDescription className="sr-only">
          Use the arrow keys to move between images. Select the image to zoom.
        </DialogDescription>
        <div className="flex items-center justify-between px-4 py-3 text-xs uppercase tracking-[0.18em] text-[#c9c1b5]">
          <span>
            {title}
            {many &&
            <span className="ml-3 tabular-nums">
                {index + 1} / {images.length}
              </span>
            }
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setZoomed((z) => !z)}
              className="rounded-sm p-2 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-ivory"
              aria-label={zoomed ? 'Zoom out' : 'Zoom in'}>
              
              {zoomed ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-sm p-2 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-ivory"
              aria-label="Close image viewer">
              
              <X className="size-5" />
            </button>
          </div>
        </div>
        <div
          className={cn(
            'relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-6',
            zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
          )}
          onMouseMove={onMove}
          onClick={() => setZoomed((z) => !z)}>
          
          <img
            src={image.src}
            alt={image.alt}
            className="max-h-full max-w-full select-none object-contain transition-transform duration-300"
            style={{ transform: zoomed ? 'scale(2.2)' : 'scale(1)', transformOrigin: origin }}
            draggable={false} />
          
          {many &&
          <>
              <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-ivory"
              aria-label="Previous image">
              
                <ChevronLeft className="size-5" />
              </button>
              <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-ivory"
              aria-label="Next image">
              
                <ChevronRight className="size-5" />
              </button>
            </>
          }
        </div>
      </DialogContent>
    </Dialog>);

}