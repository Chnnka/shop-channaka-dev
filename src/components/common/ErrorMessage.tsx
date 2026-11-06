import React from 'react';
import { CircleAlert, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ title = 'Something went wrong', message, onRetry, className }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cn('flex items-start gap-3 rounded-sm border border-[#e3c4bd] bg-[#f8ece8] p-4 text-sm', className)}>
      
      <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
      <div className="flex-1">
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-1 text-muted-foreground">{message}</p>
        {onRetry &&
        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Try again
          </Button>
        }
      </div>
    </div>);

}