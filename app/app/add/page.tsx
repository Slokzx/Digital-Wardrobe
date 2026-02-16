'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Select, type SelectOption } from '@/components/ui/Select';
import { useWardrobeStore } from '@/stores/useWardrobeStore';
import { useToastStore } from '@/stores/useToastStore';

const TYPES: SelectOption[] = [
  { value: 'Shirt', label: 'Shirt' },
  { value: 'Pants', label: 'Pants' },
  { value: 'Jacket', label: 'Jacket' },
  { value: 'Shoes', label: 'Shoes' },
  { value: 'Dress', label: 'Dress' },
  { value: 'Sweater', label: 'Sweater' },
  { value: 'Coat', label: 'Coat' },
  { value: 'Shorts', label: 'Shorts' },
  { value: 'Skirt', label: 'Skirt' },
  { value: 'Accessory', label: 'Accessory' },
];

export default function AddItemPage() {
  const router = useRouter();
  const { addItem } = useWardrobeStore();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('Shirt');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [cost, setCost] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !type || !imageUrl.trim()) {
      addToast('Name, type and image URL are required', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/wardrobe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          brand: brand.trim() || undefined,
          type,
          size: size.trim() || undefined,
          color: color.trim() || undefined,
          cost: cost ? Number(cost) : undefined,
          purchaseDate: purchaseDate || undefined,
          notes: notes.trim() || undefined,
          imageUrl: imageUrl.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add item');
      addItem(data);
      addToast('Item added', 'success');
      router.push('/app');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to add item', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Add wardrobe item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Blue denim jacket"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Image URL *</label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  type="url"
                  required
                />
                <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  Use a direct image link, e.g. https://picsum.photos/seed/xyz/800/1000
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Type *</label>
                <Select
                  options={TYPES}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Brand</label>
                  <Input
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Size</label>
                  <Input
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Color</label>
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Cost ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Purchase date</label>
                <Input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes"
                  rows={3}
                  className="w-full rounded-2xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add item'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push('/app')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
