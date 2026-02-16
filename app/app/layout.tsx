'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Toast, useToastAutoRemove } from '@/components/ui/Toast';
import { useToastStore } from '@/stores/useToastStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, hydrated, setUser, setHydrated } = useAuthStore();
  const { toggleTheme, theme } = useTheme();
  const { toasts, removeToast } = useToastStore();
  useToastAutoRemove(toasts, removeToast);

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else setUser(null);
        setHydrated(true);
      })
      .catch(() => {
        setUser(null);
        setHydrated(true);
      });
  }, [setUser, setHydrated]);

  useEffect(() => {
    if (hydrated && !user) router.replace('/auth');
  }, [hydrated, user, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.replace('/auth');
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[hsl(var(--muted-foreground))]">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
          <Link href="/app" className="font-display text-lg font-semibold">
            Digital Wardrobe
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/app">
              <Button variant={pathname === '/app' ? 'secondary' : 'ghost'} size="sm">
                Wardrobe
              </Button>
            </Link>
            <Link href="/app/add">
              <Button variant={pathname === '/app/add' ? 'secondary' : 'ghost'} size="sm">
                Add item
              </Button>
            </Link>
            <Link href="/app/profile">
              <Button variant={pathname === '/app/profile' ? 'secondary' : 'ghost'} size="sm">
                Profile
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </Button>
            <div className="flex items-center gap-2 pl-2">
              <Avatar fallback={user.name} size="sm" />
              <span className="hidden text-sm text-[hsl(var(--muted-foreground))] sm:inline">
                {user.name}
              </span>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
