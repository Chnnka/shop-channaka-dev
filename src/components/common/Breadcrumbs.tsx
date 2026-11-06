import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items, className }: {items: Crumb[];className?: string;}) {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-xs text-muted-foreground', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.to && !last ?
              <Link to={item.to} className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
                  {item.label}
                </Link> :

              <span aria-current={last ? 'page' : undefined} className={cn(last && 'text-foreground')}>
                  {item.label}
                </span>
              }
              {!last && <ChevronRight className="size-3" aria-hidden="true" />}
            </li>);

        })}
      </ol>
    </nav>);

}