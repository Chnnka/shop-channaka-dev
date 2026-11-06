import React from 'react';
import { Label } from '../ui/Label';
import { cn } from '../../utils/cn';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

/** Label + control + hint/error wiring. Pass aria-describedby={describedBy(id, …)} to the control. */
export function FormField({ id, label, required, optional, error, hint, className, children }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id} className="text-[13px] font-medium text-foreground">
        {label}
        {required &&
        <span className="text-destructive" aria-hidden="true">
            {' '}
            *
          </span>
        }
        {optional && <span className="font-normal text-muted-foreground"> (optional)</span>}
      </Label>
      {children}
      {hint && !error &&
      <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      }
      {error &&
      <p id={`${id}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      }
    </div>);

}

export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}