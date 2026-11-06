import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive, ArchiveRestore, BadgeCheck, Eye, Frame, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { adminIconButton, adminPanel, adminPrimaryLink } from '../../components/admin/adminStyles';
import { TablePagination } from '../../components/admin/TablePagination';
import { AvailabilityBadge } from '../../components/artwork/AvailabilityBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { SearchBar } from '../../components/gallery/SearchBar';
import { Button } from '../../components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { categories } from '../../data/categories';
import { useAdminArtworks } from '../../hooks/admin/useAdminArtworks';
import { useDeleteArtwork } from '../../hooks/admin/useDeleteArtwork';
import { useSetArtworkAvailability } from '../../hooks/admin/useSetArtworkAvailability';
import { usePageMeta } from '../../hooks/usePageMeta';
import type { Artwork, Availability } from '../../types/artwork';
import { matchesQuery } from '../../utils/artworkFilters';
import { getCategory } from '../../utils/categories';
import { formatDate, formatPrice } from '../../utils/format';

type AdminSort = 'updated' | 'title' | 'price-desc' | 'price-asc';
const PAGE_SIZE = 8;

export function AdminArtworks() {
  usePageMeta({ title: 'Artworks · Admin' });
  const { data: artworks = [], isPending, isError, error, refetch } = useAdminArtworks();
  const status = isPending ? 'loading' : isError ? 'error' : 'ready';
  const setAvailability = useSetArtworkAvailability();
  const deleteArtwork = useDeleteArtwork();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [availability, setAvailabilityFilter] = useState('all');
  const [sort, setSort] = useState<AdminSort>('updated');
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Artwork | null>(null);

  const filtered = useMemo(() => {
    const list = artworks.filter(
      (a) =>
      (category === 'all' || a.category === category) && (
      availability === 'all' || a.availability === availability) && (
      matchesQuery(a, query) || (a.sku ?? '').toLowerCase().includes(query.toLowerCase()))
    );
    return list.sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'price-asc') return a.price - b.price;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [artworks, query, category, availability, sort]);

  useEffect(() => setPage(1), [query, category, availability, sort]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const changeAvailability = async (a: Artwork, next: Availability, message: string) => {
    setBusyId(a.id);
    try {
      await setAvailability.mutateAsync({ id: a.id, availability: next });
      toast.success(message);
    } catch (err) {
      toast.error(`Could not update the artwork. ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const target = toDelete;
    setToDelete(null);
    setBusyId(target.id);
    try {
      await deleteArtwork.mutateAsync(target.id);
      toast.success(`“${target.title}” deleted`);
    } catch (err) {
      toast.error(`Could not delete the artwork. ${err instanceof Error ? err.message : ''}`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Artworks"
        description={status === 'ready' ? `${artworks.length} artworks in the catalogue` : 'Loading catalogue…'}
        actions={
        <Link to="/admin/artworks/new" className={adminPrimaryLink}>
            <Plus className="size-4" aria-hidden="true" />
            Add artwork
          </Link>
        } />
      

      <div className={adminPanel}>
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center">
          <SearchBar value={query} onChange={setQuery} placeholder="Search title, keyword or reference" className="lg:w-80" />
          <div className="flex flex-wrap gap-2 lg:ml-auto">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 w-[190px] rounded-sm" aria-label="Filter by category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) =>
                <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <Select value={availability} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="h-10 w-[160px] rounded-sm" aria-label="Filter by availability">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v: string) => setSort(v as AdminSort)}>
              <SelectTrigger className="h-10 w-[170px] rounded-sm" aria-label="Sort artworks">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last updated</SelectItem>
                <SelectItem value="title">Title A–Z</SelectItem>
                <SelectItem value="price-desc">Price high–low</SelectItem>
                <SelectItem value="price-asc">Price low–high</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {status === 'error' &&
        <ErrorMessage className="m-4" title="Couldn’t load artworks" message={error?.message ?? ''} onRetry={() => void refetch()} />
        }

        {status === 'loading' &&
        <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) =>
          <Skeleton key={i} className="h-14 w-full bg-sand" />
          )}
          </div>
        }

        {status === 'ready' && filtered.length === 0 &&
        <EmptyState
          icon={Frame}
          title="No artworks found"
          description="Try a different search or filter."
          action={
          <Button
            variant="outline"
            onClick={() => {
              setQuery('');
              setCategory('all');
              setAvailabilityFilter('all');
            }}>
            
                Clear filters
              </Button>
          } />

        }

        {status === 'ready' && filtered.length > 0 &&
        <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((a) => {
                const busy = busyId === a.id;
                return (
                  <TableRow key={a.id} className={busy ? 'opacity-50' : undefined}>
                      <TableCell>
                        <span className="flex size-11 items-center justify-center bg-sand p-1">
                          {a.images[0] && <img src={a.images[0].src} alt="" className="max-h-full max-w-full object-contain" />}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link to={`/admin/artworks/${a.id}/edit`} className="font-medium hover:underline">
                          {a.title}
                        </Link>
                        {a.sku && <p className="text-xs text-muted-foreground">{a.sku}</p>}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{getCategory(a.category).singular}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatPrice(a.price, a.currency)}</TableCell>
                      <TableCell>
                        <AvailabilityBadge availability={a.availability} />
                      </TableCell>
                      <TableCell>
                        {a.featured ?
                      <span className="inline-flex items-center gap-1 text-xs">
                            <Star className="size-3.5 fill-[#b8873a] text-[#b8873a]" aria-hidden="true" />
                            Featured
                          </span> :

                      <span className="text-xs text-muted-foreground">—</span>
                      }
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(a.updatedAt)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-0.5">
                          {a.availability !== 'archived' ?
                        <Link to={`/artwork/${a.slug}`} className={adminIconButton} aria-label={`View ${a.title} on site`} title="View on site">
                              <Eye className="size-4" />
                            </Link> :

                        <span className={`${adminIconButton} opacity-30`} aria-hidden="true">
                              <Eye className="size-4" />
                            </span>
                        }
                          <Link to={`/admin/artworks/${a.id}/edit`} className={adminIconButton} aria-label={`Edit ${a.title}`} title="Edit">
                            <Pencil className="size-4" />
                          </Link>
                          <button
                          type="button"
                          className={adminIconButton}
                          disabled={busy || a.availability === 'sold'}
                          onClick={() => changeAvailability(a, 'sold', `“${a.title}” marked as sold`)}
                          aria-label={`Mark ${a.title} as sold`}
                          title="Mark as sold">
                          
                            <BadgeCheck className="size-4" />
                          </button>
                          {a.availability === 'archived' ?
                        <button
                          type="button"
                          className={adminIconButton}
                          disabled={busy}
                          onClick={() => changeAvailability(a, 'available', `“${a.title}” restored`)}
                          aria-label={`Restore ${a.title}`}
                          title="Restore (publish as available)">
                          
                              <ArchiveRestore className="size-4" />
                            </button> :

                        <button
                          type="button"
                          className={adminIconButton}
                          disabled={busy}
                          onClick={() => changeAvailability(a, 'archived', `“${a.title}” archived`)}
                          aria-label={`Archive ${a.title}`}
                          title="Archive">
                          
                              <Archive className="size-4" />
                            </button>
                        }
                          <button
                          type="button"
                          className={`${adminIconButton} hover:text-destructive`}
                          disabled={busy}
                          onClick={() => setToDelete(a)}
                          aria-label={`Delete ${a.title}`}
                          title="Delete">
                          
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>);

              })}
              </TableBody>
            </Table>
            <TablePagination page={page} pageCount={pageCount} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </>
        }
      </div>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete this artwork?"
        description={`“${toDelete?.title ?? ''}” will be permanently removed, including its images and details. Consider archiving instead if it may return.`}
        confirmLabel="Delete artwork"
        destructive
        onConfirm={confirmDelete} />
      
    </div>);

}