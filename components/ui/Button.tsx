'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variant === 'primary' &&
            'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90',
          variant === 'secondary' &&
            'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:opacity-90',
          variant === 'ghost' && 'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]',
          variant === 'destructive' &&
            'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:opacity-90',
          variant === 'outline' &&
            'border border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--accent))]',
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'md' && 'h-10 px-4 text-sm',
          size === 'lg' && 'h-12 px-6 text-base',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
export { Button };
