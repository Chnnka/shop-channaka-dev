import React, { useMemo, useState } from 'react';
import { SearchX, SlidersHorizontal } from 'lucide-react';
import { ArtworkGrid } from '../components/artwork/ArtworkGrid';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { ActiveFilterChips } from '../components/gallery/ActiveFilterChips';
import { FilterPanel } from '../components/gallery/FilterPanel';
import { SearchBar } from '../components/gallery/SearchBar';
import { SortSelect } from '../components/gallery/SortSelect';
import { Button } from '../components/ui/Button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../components/ui/Sheet';
import { useCart } from '../contexts/CartContext';
import { usePublicCatalog } from '../hooks/usePublicCatalog';
import { categories } from '../data/categories';
import { useArtworkFilters } from '../hooks/useArtworkFilters';
import { usePageMeta } from '../hooks/usePageMeta';
import { applyFilters, isPublic, sortArtworks } from '../utils/artworkFilters';

export function Gallery() {
  const { artworks, status, reload } = usePublicCatalog();
  const { currency } = useCart();
  const { filters, update, toggle, reset, activeCount } = useArtworkFilters();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const singleCategory =
  filters.categories.length === 1 ? categories.find((c) => c.id === filters.categories[0]) : undefined;

  usePageMeta({
    title: singleCategory ? `${singleCategory.label} — The Gallery` : 'The Gallery',
    description: singleCategory?.description ?? 'Browse and buy original drawings, paintings and painted river stones from Sri Lanka.'
  });

  const results = useMemo(
    () => sortArtworks(applyFilters(artworks, filters, currency), filters.sort, currency),
    [artworks, filters, currency]
  );
  const total = artworks.filter(isPublic).length;
  const hasCriteria = activeCount > 0 || filters.query.trim().length > 0;

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
      <header className="border-b border-border pb-10 pt-10 md:pt-14">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Gallery' }]} />
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl font-normal leading-none md:text-7xl">The Gallery</h1>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              {singleCategory ?
              singleCategory.description :
              'Every work here is an original, made by hand in Sri Lanka. Filter by medium, size or collection to find the piece that speaks to you.'}
            </p>
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {status === 'ready' ? `${total} artworks in the collection` : '\u00a0'}
          </p>
        </div>
      </header>

      <div className="sticky top-[72px] z-20 -mx-5 flex flex-col gap-3 border-b border-border bg-ivory/95 px-5 py-4 backdrop-blur-sm md:-mx-10 md:px-10 lg:top-20">
        <div className="flex items-center gap-3">
          <SearchBar
            value={filters.query}
            onChange={(query) => update({ query })}
            placeholder="Search titles, subjects, media"
            className="flex-1 md:max-w-sm" />
          
          <Button
            variant="outline"
            className="h-10 rounded-sm lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label={`Filters${activeCount ? `, ${activeCount} active` : ''}`}>
            
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Filters</span>
            {activeCount > 0 &&
            <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] text-ivory">
                {activeCount}
              </span>
            }
          </Button>
          <div className="ml-auto">
            <SortSelect value={filters.sort} onChange={(sort) => update({ sort })} />
          </div>
        </div>
        <ActiveFilterChips filters={filters} onToggle={toggle} onReset={reset} />
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[230px_1fr]">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-48 max-h-[calc(100vh-13rem)] overflow-y-auto pb-8 pr-2">
            <FilterPanel filters={filters} onToggle={toggle} />
          </div>
        </aside>

        <section aria-label="Artworks">
          {status === 'ready' &&
          <p className="mb-8 text-xs uppercase tracking-[0.18em] text-muted-foreground" aria-live="polite">
              Showing {results.length} of {total}
            </p>
          }
          {status === 'error' && <ErrorMessage message="We couldn’t load the gallery. Please try again." onRetry={reload} />}
          {status !== 'error' && (status === 'loading' || results.length > 0) &&
          <ArtworkGrid artworks={results} loading={status === 'loading'} columns={3} />
          }
          {status === 'ready' && results.length === 0 &&
          <EmptyState
            icon={SearchX}
            title="No artworks match"
            description={
            hasCriteria ?
            'Try removing a filter or searching for something broader, like a subject (“bird”) or a medium (“pencil”).' :
            'There are no artworks to show yet.'
            }
            action={
            hasCriteria &&
            <Button variant="outline" className="h-11 rounded-sm px-6" onClick={reset}>
                    Reset all filters
                  </Button>

            } />

          }
        </section>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="flex w-full max-w-sm flex-col gap-0 bg-ivory p-0">
          <SheetHeader className="border-b border-border px-6 py-5">
            <SheetTitle className="font-serif text-2xl font-normal">Filter artworks</SheetTitle>
            <SheetDescription className="text-xs">Filters combine to narrow your results.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <FilterPanel filters={filters} onToggle={toggle} />
          </div>
          <SheetFooter className="flex-row gap-3 border-t border-border px-6 py-4">
            <Button variant="outline" className="h-11 flex-1 rounded-sm" onClick={reset} disabled={!activeCount}>
              Clear
            </Button>
            <Button className="h-11 flex-[2] rounded-sm" onClick={() => setDrawerOpen(false)}>
              Show {results.length} {results.length === 1 ? 'artwork' : 'artworks'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>);

}