import React from 'react';
import { Link } from 'react-router-dom';
import { CircleCheck, Clock, Frame, Package, Plus, Tag } from 'lucide-react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { StatCard } from '../../components/admin/StatCard';
import { FulfillmentStatusBadge, PaymentStatusBadge } from '../../components/common/StatusBadge';
import { adminPrimaryLink } from '../../components/admin/adminStyles';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useAdminArtworks } from '../../hooks/admin/useAdminArtworks';
import { useAdminOrders } from '../../hooks/admin/useAdminOrders';
import { usePageMeta } from '../../hooks/usePageMeta';
import { formatDate, formatPrice } from '../../utils/format';

export function AdminDashboard() {
  usePageMeta({ title: 'Dashboard · Admin' });
  const artworksQuery = useAdminArtworks();
  const ordersQuery = useAdminOrders();
  const artworks = artworksQuery.data ?? [];
  const orders = ordersQuery.data ?? [];
  const loading = artworksQuery.isPending || ordersQuery.isPending;
  const loadError = artworksQuery.error ?? ordersQuery.error;

  const stats = [
  { label: 'Total artworks', value: artworks.length, icon: Frame },
  { label: 'Available', value: artworks.filter((a) => a.availability === 'available').length, icon: Tag },
  { label: 'Sold', value: artworks.filter((a) => a.availability === 'sold').length, icon: CircleCheck },
  { label: 'Total orders', value: orders.length, icon: Package },
  {
    label: 'Pending orders',
    value: orders.filter((o) => o.paymentStatus === 'pending' || o.fulfillmentStatus === 'unfulfilled').length,
    icon: Clock
  }];


  const activity = [
  ...artworks.map((a) => ({ id: a.id, date: a.updatedAt, text: `“${a.title}” updated`, to: `/admin/artworks/${a.id}/edit` })),
  ...orders.map((o) => ({ id: o.id, date: o.createdAt, text: `Order ${o.orderNumber} placed by ${o.customer.name}`, to: '/admin/orders' }))].

  sort((a, b) => b.date.localeCompare(a.date)).
  slice(0, 7);

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="An overview of the studio’s artworks and orders."
        actions={
        <Link to="/admin/artworks/new" className={adminPrimaryLink}>
            <Plus className="size-4" aria-hidden="true" />
            Add artwork
          </Link>
        } />

      {loadError &&
      <ErrorMessage
        className="mb-6"
        message={`Some figures couldn’t be loaded: ${loadError.message}`}
        onRetry={() => {
          void artworksQuery.refetch();
          void ordersQuery.refetch();
        }} />

      }
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) =>
        <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} loading={loading} />
        )}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section aria-labelledby="recent-orders" className="rounded-sm border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 id="recent-orders" className="font-medium">
              Recent orders
            </h2>
            <Link to="/admin/orders" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {orders.slice(0, 5).map((o) =>
            <li key={o.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 text-sm">
                <span className="w-20 font-medium">{o.orderNumber}</span>
                <span className="min-w-0 flex-1 truncate text-muted-foreground">{o.customer.name}</span>
                <span className="tabular-nums">{formatPrice(o.total, o.currency)}</span>
                <PaymentStatusBadge status={o.paymentStatus} />
                <FulfillmentStatusBadge status={o.fulfillmentStatus} />
              </li>
            )}
            {!loading && orders.length === 0 && <li className="px-5 py-8 text-center text-sm text-muted-foreground">No orders yet.</li>}
          </ul>
        </section>

        <section aria-labelledby="activity" className="rounded-sm border border-border bg-card">
          <h2 id="activity" className="border-b border-border px-5 py-4 font-medium">
            Recent activity
          </h2>
          <ol className="px-5 py-3">
            {activity.map((item) =>
            <li key={`${item.id}-${item.date}`} className="relative border-l border-border py-2.5 pl-5">
                <span className="absolute -left-[4px] top-4 size-2 rounded-full bg-earth" aria-hidden="true" />
                <Link to={item.to} className="block text-sm hover:underline">
                  {item.text}
                </Link>
                <span className="text-xs text-muted-foreground">{formatDate(item.date)}</span>
              </li>
            )}
          </ol>
        </section>
      </div>
    </div>);

}