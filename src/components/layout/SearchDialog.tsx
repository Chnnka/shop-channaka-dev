import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { usePublicCatalog } from '../../hooks/usePublicCatalog';
import { isPublic, matchesQuery } from '../../utils/artworkFilters';
import { getCategory } from '../../utils/categories';
import { ArtworkPrice } from '../artwork/ArtworkPrice';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/Dialog';

const suggestions = ['elephant', 'landscape', 'bird', 'pebble', 'watercolour'];

export function SearchDialog({ open, onOpenChange }: {open: boolean;onOpenChange: (open: boolean) => void;}) {
  const { artworks, status } = usePublicCatalog();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = useMemo(
    () => query.trim() ? artworks.filter((a) => isPublic(a) && matchesQuery(a, query)).slice(0, 6) : [],
    [artworks, query]
  );

  const close = () => {
    onOpenChange(false);
    setQuery('');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/gallery?q=${encodeURIComponent(query.trim())}`);
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => o ? onOpenChange(true) : close()}>
      <DialogContent className="top-[12%] max-w-2xl translate-y-0 gap-0 rounded-sm bg-ivory p-0 sm:max-w-2xl">
        <DialogTitle className="sr-only">Search artworks</DialogTitle>
        <DialogDescription className="sr-only">Search by title, subject, medium or category.</DialogDescription>
        <form onSubmit={submit} className="flex items-center gap-3 border-b border-border px-5 py-4" role="search">
          <Search className="size-5 text-muted-foreground" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artworks, subjects, media…"
            aria-label="Search artworks"
            className="flex-1 bg-transparent font-serif text-2xl placeholder:text-stone-450 focus:outline-none" />
          
        </form>
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {!query.trim() &&
          <div className="p-3">
              <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Try searching for</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) =>
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-foreground focus-visible:outline-2 focus-visible:outline-ring">
                
                    {s}
                  </button>
              )}
              </div>
            </div>
          }
          {query.trim() && status === 'loading' && <p className="p-4 text-sm text-muted-foreground">Loading artworks…</p>}
          {query.trim() && status === 'ready' && results.length === 0 &&
          <p className="p-4 text-sm text-muted-foreground">
              No artworks match “{query}”. Try a subject like “bird” or a medium like “pencil”.
            </p>
          }
          {results.length > 0 &&
          <ul className="flex flex-col">
              {results.map((a) =>
            <li key={a.id}>
                  <Link
                to={`/artwork/${a.slug}`}
                onClick={close}
                className="flex items-center gap-4 rounded-sm p-3 hover:bg-sand focus-visible:bg-sand focus-visible:outline-none">
                
                    <span className="flex size-14 shrink-0 items-center justify-center bg-sand p-1">
                      <img src={a.images[0]?.src} alt="" className="max-h-full max-w-full object-contain" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-serif text-lg">{a.title}</span>
                      <span className="block text-xs text-muted-foreground">{getCategory(a.category).singular}</span>
                    </span>
                    <ArtworkPrice artwork={a} className="text-sm" />
                  </Link>
                </li>
            )}
              <li className="mt-2 border-t border-border pt-2">
                <button
                type="button"
                onClick={submit}
                className="flex w-full items-center justify-between rounded-sm p-3 text-sm hover:bg-sand focus-visible:outline-2 focus-visible:outline-ring">
                
                  See all results in the gallery
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </li>
            </ul>
          }
        </div>
      </DialogContent>
    </Dialog>);

}