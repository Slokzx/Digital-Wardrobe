'use client';

import { Button } from '@/components/ui/Button';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { useFilterStore } from '@/stores/useFilterStore';

const TYPES = ['Shirt', 'Pants', 'Jacket', 'Shoes', 'Dress', 'Sweater', 'Coat', 'Shorts', 'Skirt', 'Accessory'];
const COLORS = ['Black', 'White', 'Navy', 'Gray', 'Beige', 'Brown', 'Blue', 'Green', 'Red', 'Pink', 'Burgundy', 'Olive'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', '32', '34', '36', '8', '10'];

const typeOptions = TYPES.map((t) => ({ value: t, label: t }));
const colorOptions = COLORS.map((c) => ({ value: c, label: c }));
const sizeOptions = SIZES.map((s) => ({ value: s, label: s }));

export function FilterPanel() {
  const f = useFilterStore();
  const minCost = f.minCost ?? 0;
  const maxCost = f.maxCost ?? 500;

  return (
    <div className="mt-4 space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Type</label>
        <MultiSelect
          options={typeOptions}
          value={f.types}
          onChange={f.setTypes}
          placeholder="Any type"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Color</label>
        <MultiSelect
          options={colorOptions}
          value={f.colors}
          onChange={f.setColors}
          placeholder="Any color"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Size</label>
        <MultiSelect
          options={sizeOptions}
          value={f.sizes}
          onChange={f.setSizes}
          placeholder="Any size"
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Cost: ${minCost} – ${maxCost}
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            max={500}
            placeholder="Min"
            value={minCost === 0 && f.minCost === null ? '' : minCost}
            onChange={(e) => f.setCostRange(e.target.value ? Number(e.target.value) : null, f.maxCost ?? 500)}
            className="h-10 w-full rounded-2xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 text-sm"
          />
          <input
            type="number"
            min={0}
            max={500}
            placeholder="Max"
            value={maxCost === 500 && f.maxCost === null ? '' : maxCost}
            onChange={(e) => f.setCostRange(f.minCost ?? 0, e.target.value ? Number(e.target.value) : null)}
            className="h-10 w-full rounded-2xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Purchase from</label>
        <input
          type="date"
          value={f.dateFrom ?? ''}
          onChange={(e) => f.setDateRange(e.target.value || null, f.dateTo)}
          className="h-10 w-full rounded-2xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Purchase to</label>
        <input
          type="date"
          value={f.dateTo ?? ''}
          onChange={(e) => f.setDateRange(f.dateFrom, e.target.value || null)}
          className="h-10 w-full rounded-2xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 text-sm"
        />
      </div>
      <Button variant="outline" className="w-full" onClick={() => f.reset()}>
        Reset filters
      </Button>
    </div>
  );
}
