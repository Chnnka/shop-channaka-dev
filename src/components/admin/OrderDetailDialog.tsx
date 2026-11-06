import React, { useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateOrder } from '../../hooks/admin/useUpdateOrder';
import type { FulfillmentStatus, Order, PaymentStatus } from '../../types/commerce';
import { formatDate, formatPrice } from '../../utils/format';
import { fulfillmentStatusLabels, paymentStatusLabels } from '../common/StatusBadge';
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';

export function OrderDetailDialog({ order, onClose }: {order: Order | null;onClose: () => void;}) {
  const updateOrder = useUpdateOrder();
  const [payment, setPayment] = useState<PaymentStatus>('pending');
  const [fulfillment, setFulfillment] = useState<FulfillmentStatus>('unfulfilled');
  const saving = updateOrder.isPending;

  useEffect(() => {
    if (order) {
      setPayment(order.paymentStatus);
      setFulfillment(order.fulfillmentStatus);
    }
  }, [order]);

  const changed = order && (payment !== order.paymentStatus || fulfillment !== order.fulfillmentStatus);

  const save = () => {
    if (!order) return;
    updateOrder.mutate(
      { id: order.id, patch: { paymentStatus: payment, fulfillmentStatus: fulfillment } },
      {
        onSuccess: () => {
          toast.success(`Order ${order.orderNumber} updated`);
          onClose();
        },
        onError: (error) => toast.error(`Could not update the order: ${error.message}`)
      }
    );
  };

  const a = order?.shippingAddress;

  return (
    <Dialog open={Boolean(order)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        {order &&
        <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-serif text-2xl font-normal">
                Order {order.orderNumber}
              </DialogTitle>
              <DialogDescription>Placed {formatDate(order.createdAt)}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 text-sm sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">Customer</p>
                <p>{order.customer.name}</p>
                <p className="text-muted-foreground">{order.customer.email}</p>
                <p className="text-muted-foreground">{order.customer.phone}</p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">Ship to</p>
                {a && <p className="text-muted-foreground">{[a.line1, a.line2, a.city, a.region, a.postalCode, a.country].filter(Boolean).join(', ')}</p>}
                <p className="mt-1">{order.shippingMethod}</p>
              </div>
            </div>

            <ul className="divide-y divide-border rounded-sm border border-border">
              {order.lines.map((l) =>
            <li key={l.artworkId} className="flex items-center gap-3 p-3 text-sm">
                  <span className="flex size-12 shrink-0 items-center justify-center bg-sand p-1">
                    <img src={l.image} alt="" className="max-h-full max-w-full object-contain" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium">{l.title}</span>
                    <span className="text-xs text-muted-foreground">{l.categoryLabel} · Original, qty 1</span>
                  </span>
                  <span className="tabular-nums">{formatPrice(l.price, order.currency)}</span>
                </li>
            )}
            </ul>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{order.shipping == null ? 'To be quoted' : formatPrice(order.shipping, order.currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Payment method</dt>
                <dd>{order.paymentMethod}</dd>
              </div>
              <div className="flex justify-between font-medium">
                <dt>Total</dt>
                <dd>{formatPrice(order.total, order.currency)}</dd>
              </div>
            </dl>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="od-payment">Payment status</Label>
                <Select value={payment} onValueChange={(v) => setPayment(v as PaymentStatus)}>
                  <SelectTrigger id="od-payment" className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(paymentStatusLabels) as PaymentStatus[]).map((s) =>
                  <SelectItem key={s} value={s}>
                        {paymentStatusLabels[s]}
                      </SelectItem>
                  )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="od-fulfillment">Fulfillment status</Label>
                <Select value={fulfillment} onValueChange={(v) => setFulfillment(v as FulfillmentStatus)}>
                  <SelectTrigger id="od-fulfillment" className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(fulfillmentStatusLabels) as FulfillmentStatus[]).map((s) =>
                  <SelectItem key={s} value={s}>
                        {fulfillmentStatusLabels[s]}
                      </SelectItem>
                  )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              In production, the server prevents two paid orders from claiming the same original and updates artwork
              availability transactionally.
            </p>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={save} disabled={!changed || saving}>
                {saving && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
                Save status
              </Button>
            </DialogFooter>
          </>
        }
      </DialogContent>
    </Dialog>);

}