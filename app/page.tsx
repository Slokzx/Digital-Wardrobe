import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <span className="font-display text-xl font-semibold">Digital Wardrobe</span>
          <nav className="flex items-center gap-4">
            <Link href="/auth" className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
              Log in
            </Link>
            <Link href="/auth?tab=signup">
              <Button>Get started</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-center max-w-3xl">
          Your wardrobe, <span className="text-[hsl(var(--primary))]">organized</span>
        </h1>
        <p className="mt-6 max-w-xl text-center text-lg text-[hsl(var(--muted-foreground))]">
          Add items, filter by type and color, and browse your collection with a beautiful, fast app.
        </p>
        <div className="mt-10 flex gap-4">
          <Link href="/auth?tab=signup">
            <Button size="lg">Create account</Button>
          </Link>
          <Link href="/auth">
            <Button variant="outline" size="lg">
              Log in
            </Button>
          </Link>
        </div>
      </main>
      <footer className="border-t border-[hsl(var(--border))] py-6 text-center text-sm text-[hsl(var(--muted-foreground))]">
        Digital Wardrobe — demo app
      </footer>
    </div>
  );
}
