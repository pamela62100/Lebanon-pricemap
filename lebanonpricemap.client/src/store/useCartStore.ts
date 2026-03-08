import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartStoreComparison } from '@/types';
import { MOCK_PRODUCTS } from '@/api/mockData';

interface CartState {
  items: CartItem[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  getEnrichedItems: () => CartItem[];
  totalItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        const existing = get().items.find(i => i.productId === productId);
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
            )
          }));
        } else {
          set(state => ({ items: [...state.items, { productId, quantity: 1 }] }));
        }
      },

      removeItem: (productId) =>
        set(state => ({ items: state.items.filter(i => i.productId !== productId) })),

      updateQuantity: (productId, qty) => {
        if (qty <= 0) { get().removeItem(productId); return; }
        set(state => ({
          items: state.items.map(i =>
            i.productId === productId ? { ...i, quantity: qty } : i
          )
        }));
      },

      clearCart: () => set({ items: [] }),

      getEnrichedItems: () =>
        get().items.map(item => ({
          ...item,
          product: MOCK_PRODUCTS.find(p => p.id === item.productId)
        })),

      totalItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'rakis_cart' }
  )
);

// ─── Greedy Basket Optimization Algorithm ───────────────────────
// For each store: find verified price per item, sum totals, sort cheapest.
export function calculateStoreComparisons(
  cartItems: CartItem[],
  allPrices: any[],
  stores: any[],
  rateLbpPerUsd: number
): CartStoreComparison[] {
  return stores
    .map(store => {
      const storePrices = allPrices.filter(
        p => p.storeId === store.id && p.status === 'verified'
      );
      let totalLbp = 0;
      let itemsFound = 0;
      const missingItems: string[] = [];

      cartItems.forEach(item => {
        const priceEntry = storePrices.find(p => p.productId === item.productId);
        if (priceEntry) {
          totalLbp += priceEntry.priceLbp * item.quantity;
          itemsFound++;
        } else {
          const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
          if (product) missingItems.push(product.name);
        }
      });

      return {
        store,
        totalLbp,
        totalUsd: totalLbp / rateLbpPerUsd,
        itemsFound,
        itemsTotal: cartItems.length,
        coverage: cartItems.length > 0 ? itemsFound / cartItems.length : 0,
        missingItems,
      };
    })
    .filter(c => c.itemsFound > 0)
    .sort((a, b) => a.totalLbp - b.totalLbp);
}

// ─── Split Trip Suggestion ───────────────────────────────────────
// If splitting across 2 stores saves > 50,000 LBP → show alert
export function getSplitTripSuggestion(
  comparisons: CartStoreComparison[],
  allPrices: any[]
): string | null {
  if (comparisons.length < 2) return null;
  const best = comparisons[0];

  // Greedy: find cheapest price for each product across ALL stores
  const productIds = [...new Set(allPrices.map((p: any) => p.productId))];
  let splitTotal = 0;
  const storeNames = new Set<string>();

  productIds.forEach(pid => {
    const prices = allPrices
      .filter((p: any) => p.productId === pid && p.status === 'verified')
      .sort((a: any, b: any) => a.priceLbp - b.priceLbp);
    if (prices.length > 0) {
      splitTotal += prices[0].priceLbp;
      storeNames.add(prices[0].store?.name ?? prices[0].storeId);
    }
  });

  const savings = best.totalLbp - splitTotal;
  if (savings > 50000) {
    return `💡 Save LBP ${savings.toLocaleString()} by splitting across ${storeNames.size} stores`;
  }
  return null;
}
