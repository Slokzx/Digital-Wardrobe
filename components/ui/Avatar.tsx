'use client';

import Image from 'next/image';
import { cn } from '@/lib/cn';

export function Avatar({
  src,
  alt,
  fallback,
  className,
  size = 'md',
}: {
  src?: string | null;
  alt?: string;
  fallback?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClass = size === 'sm' ? 'h-8 w-8 text-xs' : size === 'lg' ? 'h-12 w-12 text-base' : 'h-10 w-10 text-sm';
  if (src) {
    return (
      <span
        className={cn(
          'relative inline-flex shrink-0 overflow-hidden rounded-full',
          sizeClass,
          className
        )}
      >
        <Image src={src} alt={alt || 'Avatar'} fill className="object-cover" sizes="96px" />
      </span>
    );
  }
  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-full bg-[hsl(var(--primary))] font-medium text-[hsl(var(--primary-foreground))]',
        sizeClass,
        className
      )}
    >
      {fallback?.slice(0, 2).toUpperCase() || '?'}
    </span>
  );
}
