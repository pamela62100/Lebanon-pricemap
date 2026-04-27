import { create } from 'zustand';
import { cartApi } from '@/api/cart.api';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productNameAr?: string;
  storeId?: string;
  storeName?: string;
  quantity: number;
}

export interface BasketItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPriceLbp?: number | null;
}

export interface StoreBasketCost {
  storeId: string;
  storeName: string;
  totalLbp: number;
  foundCount: number;
  totalCount: number;
  isComplete: boolean;
  foundItems: BasketItem[];
  missingItems: BasketItem[];
}

export interface CartOptimizationResult {
  totalItemCount: number;
  stores: StoreBasketCost[];
  bestCompleteStoreId?: string | null;
  cheapestPartialStoreId?: string | null;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  optimization: CartOptimizationResult | null;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  optimizeCart: () => Promise<void>;
  totalItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  optimization: null,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await cartApi.getCart();
      const data = res.data?.data ?? res.data;
      set({ items: data?.items ?? [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    const res = await cartApi.addItem({ productId, quantity });
    const data = res.data?.data ?? res.data;
    set({ items: data?.items ?? [] });
  },

  removeItem: async (itemId) => {
    await cartApi.removeItem(itemId);
    set(state => ({ items: state.items.filter(i => i.id !== itemId) }));
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity <= 0) {
      await get().removeItem(itemId);
      return;
    }
    const res = await cartApi.updateQuantity(itemId, quantity);
    const data = res.data?.data ?? res.data;
    set({ items: data?.items ?? [] });
  },

  clearCart: async () => {
    await cartApi.clearCart();
    set({ items: [], optimization: null });
  },

  optimizeCart: async () => {
    set({ isLoading: true });
    try {
      const res = await cartApi.optimize();
      const data = res.data?.data ?? res.data;
      set({ optimization: data });
    } finally {
      set({ isLoading: false });
    }
  },

  totalItemCount: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
