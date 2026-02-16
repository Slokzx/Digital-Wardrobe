'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useWardrobeStore, type WardrobeItem } from '@/stores/useWardrobeStore';
import { useFilterStore } from '@/stores/useFilterStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FilterPanel } from './FilterPanel';
import { ItemSheet } from './ItemSheet';

const TYPES = ['Shirt', 'Pants', 'Jacket', 'Shoes', 'Dress', 'Sweater', 'Coat', 'Shorts', 'Skirt', 'Accessory'];
const COLORS = ['Black', 'White', 'Navy', 'Gray', 'Beige', 'Brown', 'Blue', 'Green', 'Red', 'Pink', 'Burgundy', 'Olive'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', '32', '34', '36', '8', '10'];
const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest' },
  { value: 'createdAt-asc', label: 'Oldest' },
  { value: 'cost-desc', label: 'Price high' },
  { value: 'cost-asc', label: 'Price low' },
  { value: 'purchaseDate-desc', label: 'Recent purchase' },
];

function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

function WardrobeGrid() {
  const { items, loading, openItem, fetchItems, closeItem, selectedItemId, sheetOpen } = useWardrobeStore();
  const filters = useFilterStore();
  const debouncedSearch = useDebounce(filters.search, 300);
  const queryParams = useMemo(() => {
    const p = filters.toQueryParams();
    p.set('limit', '50');
    p.set('offset', '0');
    return p;
  }, [filters.search, filters.types, filters.colors, filters.sizes, filters.minCost, filters.maxCost, filters.dateFrom, filters.dateTo, filters.sort, filters.order]);

  useEffect(() => {
    fetchItems({ params: queryParams });
  }, [debouncedSearch, queryParams.toString()]);

  const selectedItem = useMemo(
    () => (selectedItemId ? items.find((i) => i.id === selectedItemId) : null),
    [items, selectedItemId]
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-[hsl(var(--muted))]" />
            ))
          ) : (
            items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.02 }}
                className="cursor-pointer"
                onClick={() => openItem(item.id)}
              >
                <Card className="group overflow-hidden transition-shadow hover:shadow-soft-lg">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl bg-[hsl(var(--muted))]">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 20vw"
                      unoptimized={item.imageUrl.includes('picsum')}
                    />
                    <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {item.type}
                      </Badge>
                      {item.color && (
                        <Badge variant="outline" className="text-xs">
                          {item.color}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="truncate font-medium">{item.name}</p>
                    {item.brand && (
                      <p className="truncate text-xs text-[hsl(var(--muted-foreground))]">{item.brand}</p>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      <ItemSheet
        open={sheetOpen}
        onClose={closeItem}
        itemId={selectedItemId}
        selectedItem={selectedItem}
      />
    </>
  );
}

export default function WardrobePage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortValue, setSortValue] = useState('createdAt-desc');
  const filters = useFilterStore();

  const updateSort = (v: string) => {
    setSortValue(v);
    const [sort, order] = v.split('-') as ['createdAt' | 'cost' | 'purchaseDate', 'asc' | 'desc'];
    filters.setSort(sort, order);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => filters.setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            Filters
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortValue}
            onChange={(e) => updateSort(e.target.value)}
            className="h-10 rounded-2xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-4 text-sm"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <FilterPanel />
        </aside>
        {filterOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="absolute left-0 top-0 h-full w-72 overflow-y-auto border-r border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4"
            >
              <div className="flex justify-between">
                <span className="font-semibold">Filters</span>
                <Button variant="ghost" size="sm" onClick={() => setFilterOpen(false)}>
                  ✕
                </Button>
              </div>
              <FilterPanel />
            </motion.aside>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <WardrobeGrid />
        </div>
      </div>
    </div>
  );
}

