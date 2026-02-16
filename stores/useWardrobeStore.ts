import { create } from 'zustand';

export interface WardrobeItem {
  id: string;
  userId: string;
  name: string;
  brand: string | null;
  type: string;
  size: string | null;
  color: string | null;
  cost: number | null;
  purchaseDate: string | null;
  notes: string | null;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface WardrobeState {
  items: WardrobeItem[];
  totalCount: number;
  loading: boolean;
  selectedItemId: string | null;
  sheetOpen: boolean;
  setItems: (items: WardrobeItem[], totalCount: number) => void;
  setLoading: (v: boolean) => void;
  setSelectedItem: (id: string | null) => void;
  setSheetOpen: (v: boolean) => void;
  openItem: (id: string) => void;
  closeItem: () => void;
  addItem: (item: WardrobeItem) => void;
  removeItem: (id: string) => void;
  fetchItems: (params: { limit?: number; offset?: number; params?: URLSearchParams }) => Promise<void>;
  fetchItem: (id: string) => Promise<WardrobeItem | null>;
}

export const useWardrobeStore = create<WardrobeState>((set, get) => ({
  items: [],
  totalCount: 0,
  loading: false,
  selectedItemId: null,
  sheetOpen: false,
  setItems: (items, totalCount) => set({ items, totalCount }),
  setLoading: (loading) => set({ loading }),
  setSelectedItem: (selectedItemId) => set({ selectedItemId }),
  setSheetOpen: (sheetOpen) => set({ sheetOpen }),
  openItem: (id) => set({ selectedItemId: id, sheetOpen: true }),
  closeItem: () => set({ sheetOpen: false, selectedItemId: null }),
  addItem: (item) => set((s) => ({ items: [item, ...s.items], totalCount: s.totalCount + 1 })),
  removeItem: (id) =>
    set((s) => ({
      items: s.items.filter((i) => i.id !== id),
      totalCount: Math.max(0, s.totalCount - 1),
      selectedItemId: s.selectedItemId === id ? null : s.selectedItemId,
      sheetOpen: s.selectedItemId === id ? false : s.sheetOpen,
    })),
  fetchItems: async ({ limit = 50, offset = 0, params }) => {
    set({ loading: true });
    try {
      const query = params?.toString() ?? '';
      const res = await fetch(`/api/wardrobe?limit=${limit}&offset=${offset}${query ? `&${query}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      set({ items: data.items, totalCount: data.totalCount });
    } catch (e) {
      console.error(e);
      set({ items: [], totalCount: 0 });
    } finally {
      set({ loading: false });
    }
  },
  fetchItem: async (id) => {
    const res = await fetch(`/api/wardrobe/${id}`);
    if (!res.ok) return null;
    return res.json();
  },
}));
