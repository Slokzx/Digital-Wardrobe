import { create } from 'zustand';
import type { ToastItem } from '@/components/ui/Toast';

interface ToastState {
  toasts: ToastItem[];
  addToast: (message: string, type?: 'success' | 'error' | 'default') => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'default') =>
    set((s) => ({
      toasts: [...s.toasts, { id: Math.random().toString(36).slice(2), message, type }],
    })),
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
