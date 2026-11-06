import React from 'react';
import { cn } from '../../utils/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  as: Tag = 'h2',
  className
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'items-center text-center md:flex-col md:items-center',
        className
      )}>
      
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-earth">{eyebrow}</p>}
        <Tag className="font-serif text-4xl font-normal leading-[1.05] text-foreground md:text-5xl">{title}</Tag>
        {description && <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>);

}