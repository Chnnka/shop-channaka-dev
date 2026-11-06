import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** Debounced search input. */
export function SearchBar({ value, onChange, placeholder = 'Search the gallery', className }: SearchBarProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    if (local === value) return;
    const t = setTimeout(() => onChange(local), 250);
    return () => clearTimeout(t);
  }, [local, value, onChange]);

  return (
    <div role="search" className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-sm border border-input bg-transparent pl-9 pr-9 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#8a6a4f]/25 [&::-webkit-search-cancel-button]:hidden" />
      
      {local &&
      <button
        type="button"
        onClick={() => {
          setLocal('');
          onChange('');
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        aria-label="Clear search">
        
          <X className="size-4" />
        </button>
      }
    </div>);

}