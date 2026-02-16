'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Avatar } from '@/components/ui/Avatar';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    logout();
    router.replace('/auth');
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar fallback={user.name} size="lg" />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{user.email}</p>
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium text-[hsl(var(--muted-foreground))]">Preferences</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm">Theme</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </Button>
              </div>
            </div>
            <div className="border-t border-[hsl(var(--border))] pt-4">
              <Button variant="destructive" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
