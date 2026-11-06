import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function TablePagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange






}: {page: number;pageCount: number;total: number;pageSize: number;onPageChange: (page: number) => void;}) {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4 border-t border-border px-4 py-3 text-sm">
      <p className="text-muted-foreground">
        {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Button>
        <span className="tabular-nums text-muted-foreground">
          Page {page} of {pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page">
          
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>);

}