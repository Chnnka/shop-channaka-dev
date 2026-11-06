import React from "react";
import { cn } from "../../utils/cn";
import { BoxIcon } from "lucide-react";
interface EmptyStateProps {
  icon: BoxIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return <div className={cn('flex flex-col items-center justify-center px-6 py-20 text-center', className)}>
      <div className="mb-6 flex size-14 items-center justify-center rounded-full border border-border bg-sand">
        <Icon className="size-5 text-earth" aria-hidden="true" strokeWidth={1.5} />
      </div>
      <h2 className="font-serif text-3xl text-foreground">{title}</h2>
      {description && <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>;
}