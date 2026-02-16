'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/cn';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = 'Select...',
  className,
}: {
  options: MultiSelectOption[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };

  const labels = value.map((v) => options.find((o) => o.value === v)?.label ?? v);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center justify-between rounded-2xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
      >
        <span className={cn(!labels.length && 'text-[hsl(var(--muted-foreground))]')}>
          {labels.length ? labels.join(', ') : placeholder}
        </span>
        <span className="text-[hsl(var(--muted-foreground))]">▾</span>
      </button>
      {open && (
        <div className="absolute top-full z-10 mt-1 max-h-60 w-full overflow-auto rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-1 shadow-soft">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => toggle(o.value)}
              className={cn(
                'flex w-full px-4 py-2 text-left text-sm hover:bg-[hsl(var(--accent))]',
                value.includes(o.value) && 'bg-[hsl(var(--accent))] font-medium'
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
