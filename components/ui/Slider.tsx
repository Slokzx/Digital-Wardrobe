'use client';

import { cn } from '@/lib/cn';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  valueLabel?: string;
}

export function Slider({ className, label, valueLabel, value, ...props }: SliderProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {(label || valueLabel) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-[hsl(var(--muted-foreground))]">{label}</span>}
          {valueLabel != null && <span>{valueLabel}</span>}
        </div>
      )}
      <input
        type="range"
        value={value}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[hsl(var(--muted))] accent-[hsl(var(--primary))]"
        {...props}
      />
    </div>
  );
}
