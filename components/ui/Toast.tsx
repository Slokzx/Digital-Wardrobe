'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

export type ToastType = 'success' | 'error' | 'default';

export interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
}

interface ToastProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
  className?: string;
}

export function Toast({ toasts, removeToast, className }: ToastProps) {
  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-[100] flex flex-col gap-2',
        className
      )}
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={cn(
              'rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm shadow-soft',
              t.type === 'success' && 'border-green-500/50',
              t.type === 'error' && 'border-[hsl(var(--destructive))]/50'
            )}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useToastAutoRemove(toasts: ToastItem[], remove: (id: string) => void, ms = 4000) {
  useEffect(() => {
    if (toasts.length === 0) return;
    const id = toasts[toasts.length - 1].id;
    const t = setTimeout(() => remove(id), ms);
    return () => clearTimeout(t);
  }, [toasts, remove, ms]);
}
