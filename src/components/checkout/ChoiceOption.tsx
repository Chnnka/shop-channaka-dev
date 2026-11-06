import React from 'react';
import { RadioGroupItem } from '../ui/RadioGroup';
import { cn } from '../../utils/cn';

interface ChoiceOptionProps {
  id: string;
  value: string;
  selected: boolean;
  title: string;
  description: string;
  meta?: React.ReactNode;
  aside?: React.ReactNode;
}

export function ChoiceOption({ id, value, selected, title, description, meta, aside }: ChoiceOptionProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-start gap-4 rounded-sm border p-4 transition-colors',
        selected ? 'border-foreground bg-card' : 'border-border hover:border-[#bfb3a2]'
      )}>
      
      <RadioGroupItem id={id} value={value} className="mt-1" />
      <span className="flex-1">
        <span className="flex items-start justify-between gap-4">
          <span className="text-sm font-medium">{title}</span>
          {aside && <span className="text-right text-sm tabular-nums">{aside}</span>}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{description}</span>
        {meta && <span className="mt-1.5 block text-xs text-foreground">{meta}</span>}
      </span>
    </label>);

}