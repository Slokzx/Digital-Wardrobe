'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
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
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file (JPEG, PNG, WebP or GIF)', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image must be under 5MB', 'error');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setImageUrl(data.url);
      setPreviewUrl(data.url);
      addToast('Photo uploaded', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Upload failed', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalImageUrl = imageUrl.trim();
    if (!name.trim() || !type || !finalImageUrl) {
      addToast('Name, type and a photo (upload or URL) are required', 'error');
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
          imageUrl: finalImageUrl,
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
                <label className="mb-1 block text-sm font-medium">Photo *</label>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Upload photo'}
                    </Button>
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                      or paste a URL below
                    </span>
                  </div>
                  <Input
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setPreviewUrl(e.target.value.trim() || null);
                    }}
                    placeholder="https://... or upload above"
                    type="url"
                  />
                  {previewUrl && (
                    <div className="relative aspect-[3/4] max-h-48 w-full overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized={previewUrl.includes('uploads')}
                      />
                    </div>
                  )}
                </div>
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
