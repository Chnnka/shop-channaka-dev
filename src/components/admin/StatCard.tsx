import React from "react";
import { Skeleton } from "../ui/Skeleton";
import { BoxIcon } from "lucide-react";
export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  loading






}: {label: string;value: number | string;icon: BoxIcon;hint?: string;loading?: boolean;}) {
  return <div className="rounded-sm border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <Icon className="size-4 text-earth" aria-hidden="true" strokeWidth={1.75} />
      </div>
      {loading ? <Skeleton className="mt-4 h-9 w-16 bg-sand" /> : <p className="mt-3 font-serif text-4xl tabular-nums">{value}</p>}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>;
}