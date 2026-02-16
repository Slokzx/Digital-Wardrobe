'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Sheet, SheetHeader, SheetTitle, SheetContent } from '@/components/ui/Sheet';
import { useWardrobeStore, type WardrobeItem } from '@/stores/useWardrobeStore';
import { useToastStore } from '@/stores/useToastStore';

export function ItemSheet({
  open,
  onClose,
  itemId: itemIdProp,
  selectedItem: selectedItemProp,
}: {
  open: boolean;
  onClose: () => void;
  itemId: string | null;
  selectedItem: WardrobeItem | null | undefined;
}) {
  const { fetchItem, removeItem, closeItem } = useWardrobeStore();
  const { addToast } = useToastStore();
  const [item, setItem] = useState<WardrobeItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !itemIdProp) {
      setItem(null);
      return;
    }
    if (selectedItemProp && selectedItemProp.id === itemIdProp) {
      setItem(selectedItemProp);
      return;
    }
    setLoading(true);
    fetchItem(itemIdProp).then((data) => {
      setItem(data ?? null);
      setLoading(false);
    });
  }, [open, itemIdProp, selectedItemProp, fetchItem]);

  const handleDelete = async () => {
    if (!item) return;
    try {
      const res = await fetch(`/api/wardrobe/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      removeItem(item.id);
      addToast('Item removed', 'success');
      onClose();
    } catch {
      addToast('Could not delete item', 'error');
    }
  };

  return (
    <Sheet open={open} onClose={onClose} side="right">
      <SheetHeader>
        <SheetTitle>{item ? item.name : 'Item details'}</SheetTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </SheetHeader>
      <SheetContent>
        {loading && <p className="text-[hsl(var(--muted-foreground))]">Loading...</p>}
        {item && !loading && (
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[hsl(var(--muted))]">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes="400px"
                unoptimized={item.imageUrl.includes('picsum')}
              />
            </div>
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[hsl(var(--muted-foreground))]">Brand</dt>
                <dd>{item.brand || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[hsl(var(--muted-foreground))]">Type</dt>
                <dd>{item.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[hsl(var(--muted-foreground))]">Size</dt>
                <dd>{item.size || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[hsl(var(--muted-foreground))]">Color</dt>
                <dd>{item.color || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[hsl(var(--muted-foreground))]">Cost</dt>
                <dd>{item.cost != null ? `$${item.cost.toFixed(2)}` : '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[hsl(var(--muted-foreground))]">Purchase date</dt>
                <dd>{item.purchaseDate || '—'}</dd>
              </div>
            </dl>
            {item.notes && (
              <div>
                <h4 className="mb-1 text-sm font-medium text-[hsl(var(--muted-foreground))]">Notes</h4>
                <p className="text-sm">{item.notes}</p>
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
