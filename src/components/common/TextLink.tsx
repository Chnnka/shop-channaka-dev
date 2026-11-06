import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function TextLink({ to, children, className }: {to: string;children: React.ReactNode;className?: string;}) {
  return (
    <Link
      to={to}
      className={cn(
        'group inline-flex items-center gap-2 border-b border-foreground pb-1 text-[12px] uppercase tracking-[0.2em] text-foreground transition-colors hover:border-earth hover:text-earth focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
        className
      )}>
      
      {children}
      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>);

}