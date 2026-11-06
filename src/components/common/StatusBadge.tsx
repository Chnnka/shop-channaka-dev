import React from "react";
import { Ban, CircleCheck, CircleDashed, CircleX, Clock, PackageCheck, RotateCcw, Truck, BoxIcon } from "lucide-react";
import { FulfillmentStatus, PaymentStatus } from "../../types/commerce";
import { cn } from "../../utils/cn";
type Tone = 'positive' | 'warning' | 'negative' | 'neutral' | 'info';
const toneClass: Record<Tone, string> = {
  positive: 'bg-[#eef1e6] text-[#4b5a33] border-[#d6ddc4]',
  warning: 'bg-[#f7efdf] text-[#7d5b1f] border-[#ead9b6]',
  negative: 'bg-[#f8ece8] text-[#8a2f23] border-[#ecd0c9]',
  neutral: 'bg-sand text-muted-foreground border-border',
  info: 'bg-[#eceff0] text-[#3f4c52] border-[#d5dcdf]'
};
const paymentMap: Record<PaymentStatus, {
  label: string;
  tone: Tone;
  icon: BoxIcon;
}> = {
  pending: {
    label: 'Pending',
    tone: 'warning',
    icon: Clock
  },
  paid: {
    label: 'Paid',
    tone: 'positive',
    icon: CircleCheck
  },
  failed: {
    label: 'Failed',
    tone: 'negative',
    icon: CircleX
  },
  refunded: {
    label: 'Refunded',
    tone: 'neutral',
    icon: RotateCcw
  }
};
const fulfillmentMap: Record<FulfillmentStatus, {
  label: string;
  tone: Tone;
  icon: BoxIcon;
}> = {
  unfulfilled: {
    label: 'Unfulfilled',
    tone: 'neutral',
    icon: CircleDashed
  },
  processing: {
    label: 'Processing',
    tone: 'info',
    icon: Clock
  },
  shipped: {
    label: 'Shipped',
    tone: 'info',
    icon: Truck
  },
  delivered: {
    label: 'Delivered',
    tone: 'positive',
    icon: PackageCheck
  },
  cancelled: {
    label: 'Cancelled',
    tone: 'negative',
    icon: Ban
  }
};
export function StatusPill({
  label,
  tone,
  icon: Icon,
  className





}: {label: string;tone: Tone;icon?: BoxIcon;className?: string;}) {
  return <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-sm border px-2 py-0.5 text-[11px] font-medium', toneClass[tone], className)}>
      {Icon && <Icon className="size-3" aria-hidden="true" />}
      {label}
    </span>;
}
export function PaymentStatusBadge({
  status


}: {status: PaymentStatus;}) {
  const s = paymentMap[status];
  return <StatusPill label={s.label} tone={s.tone} icon={s.icon} />;
}
export function FulfillmentStatusBadge({
  status


}: {status: FulfillmentStatus;}) {
  const s = fulfillmentMap[status];
  return <StatusPill label={s.label} tone={s.tone} icon={s.icon} />;
}
export const paymentStatusLabels = Object.fromEntries(Object.entries(paymentMap).map(([k, v]) => [k, v.label])) as Record<PaymentStatus, string>;
export const fulfillmentStatusLabels = Object.fromEntries(Object.entries(fulfillmentMap).map(([k, v]) => [k, v.label])) as Record<FulfillmentStatus, string>;