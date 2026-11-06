import React from 'react';
import type { Availability } from '../../types/artwork';
import { cn } from '../../utils/cn';

const config: Record<Availability, {label: string;dot: string;}> = {
  available: { label: 'Available', dot: 'bg-[#6b7f4e]' },
  reserved: { label: 'Reserved', dot: 'bg-[#b8873a]' },
  sold: { label: 'Sold', dot: 'bg-[#9a3b2e]' },
  archived: { label: 'Unpublished', dot: 'bg-stone-400' }
};

interface AvailabilityBadgeProps {
  availability: Availability;
  variant?: 'inline' | 'overlay';
  className?: string;
}

/** Always shows a text label — never relies on colour alone. */
export function AvailabilityBadge({ availability, variant = 'inline', className }: AvailabilityBadgeProps) {
  const c = config[availability];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em]',
        variant === 'inline' && 'text-muted-foreground',
        variant === 'overlay' && 'bg-ivory/95 px-2.5 py-1 text-foreground',
        className
      )}>
      
      <span className={cn('size-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>);

}

export const availabilityLabels: Record<Availability, string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
  archived: 'Archived / unpublished'
};