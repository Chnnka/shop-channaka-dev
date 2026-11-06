import React from 'react';
import { FlaskConical } from 'lucide-react';
import { cn } from '../../utils/cn';

export function PrototypeNotice({ children, className }: {children: React.ReactNode;className?: string;}) {
  return (
    <p
      className={cn(
        'flex items-start gap-2 rounded-sm border border-dashed border-[#d8c7ae] bg-[#f6efe3] px-3 py-2 text-xs leading-relaxed text-[#6b5536]',
        className
      )}>
      
      <FlaskConical className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>);

}