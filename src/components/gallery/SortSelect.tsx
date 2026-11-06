import React from 'react';
import { sortOptions, type SortOption } from '../../data/filters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';

export function SortSelect({ value, onChange }: {value: SortOption;onChange: (value: SortOption) => void;}) {
  return (
    <div className="flex items-center gap-2">
      <span id="sort-label" className="hidden text-xs text-muted-foreground sm:inline">
        Sort by
      </span>
      <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
        <SelectTrigger aria-labelledby="sort-label" className="h-10 min-w-[180px] rounded-sm bg-transparent">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((o) =>
          <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>);

}