'use client';

import { cn } from '@/lib/cn';

export function Badge({
  className,
  variant = 'secondary',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'secondary' | 'outline' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]',
        variant === 'secondary' && 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]',
        variant === 'outline' && 'border border-[hsl(var(--border))]',
        className
      )}
      {...props}
    />
  );
}
