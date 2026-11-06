import React, { useEffect, useMemo, useState } from 'react';
import { Package } from 'lucide-react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { adminPanel } from '../../components/admin/adminStyles';
import { OrderDetailDialog } from '../../components/admin/OrderDetailDialog';
import { TablePagination } from '../../components/admin/TablePagination';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import {
  FulfillmentStatusBadge,
  fulfillmentStatusLabels,
  PaymentStatusBadge,
  paymentStatusLabels } from
'../../components/common/StatusBadge';
import { SearchBar } from '../../components/gallery/SearchBar';
import { Button } from '../../components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { useAdminOrders } from '../../hooks/admin/useAdminOrders';
import { usePageMeta } from '../../hooks/usePageMeta';
import type { FulfillmentStatus, Order, PaymentStatus } from '../../types/commerce';
import { formatDate, formatPrice } from '../../utils/format';

const PAGE_SIZE = 10;

export function AdminOrders() {
  usePageMeta({ title: 'Orders · Admin' });
  const { data: orders = [], isPending, isError, error, refetch } = useAdminOrders();
  const status = isPending ? 'loading' : isError ? 'error' : 'ready';
  const [query, setQuery] = useState('');
  const [payment, setPayment] = useState<'all' | PaymentStatus>('all');
  const [fulfillment, setFulfillment] = useState<'all' | FulfillmentStatus>('all');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.
    filter(
      (o) =>
      (payment === 'all' || o.paymentStatus === payment) && (
      fulfillment === 'all' || o.fulfillmentStatus === fulfillment) && (
      !q || o.orderNumber.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.email.toLowerCase().includes(q))
    ).
    sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders, query, payment, fulfillment]);

  useEffect(() => setPage(1), [query, payment, fulfillment]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected: Order | null = orders.find((o) => o.id === selectedId) ?? null;

  return (
    <div>
      <AdminPageHeader title="Orders" description="Review orders and update payment and fulfillment status." />
      <div className={adminPanel}>
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center">
          <SearchBar value={query} onChange={setQuery} placeholder="Search order #, name or email" className="lg:w-80" />
          <div className="flex flex-wrap gap-2 lg:ml-auto">
            <Select value={payment} onValueChange={(v) => setPayment(v as 'all' | PaymentStatus)}>
              <SelectTrigger className="h-10 w-[170px] rounded-sm" aria-label="Filter by payment status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All payments</SelectItem>
                {(Object.keys(paymentStatusLabels) as PaymentStatus[]).map((s) =>
                <SelectItem key={s} value={s}>
                    {paymentStatusLabels[s]}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <Select value={fulfillment} onValueChange={(v) => setFulfillment(v as 'all' | FulfillmentStatus)}>
              <SelectTrigger className="h-10 w-[180px] rounded-sm" aria-label="Filter by fulfillment status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All fulfillment</SelectItem>
                {(Object.keys(fulfillmentStatusLabels) as FulfillmentStatus[]).map((s) =>
                <SelectItem key={s} value={s}>
                    {fulfillmentStatusLabels[s]}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {status === 'error' &&
        <ErrorMessage className="m-4" title="Couldn’t load orders" message={error?.message ?? ''} onRetry={() => void refetch()} />
        }
        {status === 'loading' &&
        <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, i) =>
          <Skeleton key={i} className="h-12 w-full bg-sand" />
          )}
          </div>
        }
        {status === 'ready' && filtered.length === 0 &&
        <EmptyState icon={Package} title="No orders found" description="Try adjusting your search or filters." />
        }
        {status === 'ready' && filtered.length > 0 &&
        <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Artworks</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Fulfillment</TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((o) =>
              <TableRow key={o.id} className="cursor-pointer" onClick={() => setSelectedId(o.id)}>
                    <TableCell className="font-medium">
                      {o.orderNumber}
                    </TableCell>
                    <TableCell>
                      <span className="block">{o.customer.name}</span>
                      <span className="text-xs text-muted-foreground">{o.shippingAddress.country}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(o.createdAt)}</TableCell>
                    <TableCell className="text-center tabular-nums">{o.lines.length}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatPrice(o.total, o.currency)}</TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={o.paymentStatus} />
                    </TableCell>
                    <TableCell>
                      <FulfillmentStatusBadge status={o.fulfillmentStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(o.id);
                    }}>
                    
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
              )}
              </TableBody>
            </Table>
            <TablePagination page={page} pageCount={pageCount} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </>
        }
      </div>
      <OrderDetailDialog order={selected} onClose={() => setSelectedId(null)} />
    </div>);

}