import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import type { ArtworkImage } from '../../types/artwork';
import { cn } from '../../utils/cn';
import { ArtworkLightbox } from './ArtworkLightbox';

const kindLabel: Record<ArtworkImage['kind'], string> = {
  artwork: 'Artwork',
  detail: 'Detail',
  room: 'In situ',
  process: 'In the studio'
};

export function ArtworkImageGallery({ images, title }: {images: ArtworkImage[];title: string;}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const current = images[active];

  if (!current) {
    return <div className="flex aspect-[4/5] items-center justify-center bg-sand text-sm text-muted-foreground">No image</div>;
  }

  const fillsFrame = current.kind === 'room' || current.kind === 'process';

  return (
    <div className="flex flex-col gap-4 md:flex-row-reverse">
      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-sand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring lg:aspect-auto lg:h-[min(82vh,860px)]"
          aria-label={`Open ${title} in full-screen viewer`}>
          
          <div className={cn('absolute inset-0 flex items-center justify-center', fillsFrame ? 'p-0' : 'p-[8%]')}>
            <img
              src={current.src}
              alt={current.alt}
              className={cn(
                fillsFrame ?
                'h-full w-full object-cover' :
                'max-h-full max-w-full object-contain shadow-[0_24px_50px_-24px_rgba(31,29,26,0.5)]'
              )} />
            
          </div>
          <span className="absolute bottom-4 right-4 flex items-center gap-2 bg-ivory/95 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-foreground opacity-90 transition-opacity group-hover:opacity-100">
            <Maximize2 className="size-3.5" aria-hidden="true" />
            View larger
          </span>
        </button>
      </div>
      {images.length > 1 &&
      <div className="flex gap-3 md:w-20 md:flex-col" role="tablist" aria-label="Artwork images">
          {images.map((img, i) =>
        <button
          key={img.id}
          type="button"
          role="tab"
          aria-selected={i === active}
          aria-label={`${kindLabel[img.kind]} view ${i + 1}`}
          onClick={() => setActive(i)}
          className={cn(
            'relative aspect-square w-20 shrink-0 overflow-hidden bg-sand p-1.5 ring-1 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            i === active ? 'ring-foreground' : 'ring-transparent hover:ring-border'
          )}>
          
              <img src={img.src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
        )}
        </div>
      }
      <ArtworkLightbox
        open={lightbox}
        onOpenChange={setLightbox}
        images={images}
        index={active}
        onIndexChange={setActive}
        title={title} />
      
    </div>);

}