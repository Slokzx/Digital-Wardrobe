import { create } from 'zustand';

export interface FilterState {
  search: string;
  types: string[];
  colors: string[];
  sizes: string[];
  minCost: number | null;
  maxCost: number | null;
  dateFrom: string | null;
  dateTo: string | null;
  sort: 'createdAt' | 'cost' | 'purchaseDate';
  order: 'asc' | 'desc';
  setSearch: (v: string) => void;
  setTypes: (v: string[]) => void;
  setColors: (v: string[]) => void;
  setSizes: (v: string[]) => void;
  setCostRange: (min: number | null, max: number | null) => void;
  setDateRange: (from: string | null, to: string | null) => void;
  setSort: (sort: 'createdAt' | 'cost' | 'purchaseDate', order?: 'asc' | 'desc') => void;
  toQueryParams: () => URLSearchParams;
  reset: () => void;
}

const defaultState = {
  search: '',
  types: [] as string[],
  colors: [] as string[],
  sizes: [] as string[],
  minCost: null as number | null,
  maxCost: null as number | null,
  dateFrom: null as string | null,
  dateTo: null as string | null,
  sort: 'createdAt' as const,
  order: 'desc' as const,
};

export const useFilterStore = create<FilterState>((set, get) => ({
  ...defaultState,
  setSearch: (search) => set({ search }),
  setTypes: (types) => set({ types }),
  setColors: (colors) => set({ colors }),
  setSizes: (sizes) => set({ sizes }),
  setCostRange: (minCost, maxCost) => set({ minCost, maxCost }),
  setDateRange: (dateFrom, dateTo) => set({ dateFrom, dateTo }),
  setSort: (sort, order) => set({ sort, order: order ?? get().order }),
  toQueryParams: () => {
    const s = get();
    const p = new URLSearchParams();
    if (s.search) p.set('search', s.search);
    if (s.types.length) p.set('types', s.types.join(','));
    if (s.colors.length) p.set('colors', s.colors.join(','));
    if (s.sizes.length) p.set('sizes', s.sizes.join(','));
    if (s.minCost != null) p.set('minCost', String(s.minCost));
    if (s.maxCost != null) p.set('maxCost', String(s.maxCost));
    if (s.dateFrom) p.set('dateFrom', s.dateFrom);
    if (s.dateTo) p.set('dateTo', s.dateTo);
    p.set('sort', s.sort);
    p.set('order', s.order);
    return p;
  },
  reset: () => set(defaultState),
}));
