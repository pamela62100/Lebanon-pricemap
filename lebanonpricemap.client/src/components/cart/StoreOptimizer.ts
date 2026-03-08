import { useMemo } from 'react';
import type { PriceEntry } from '@/types';
import { getEnrichedPriceEntries, MOCK_PRODUCTS } from '@/api/mockData';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
}

export interface StoreTotal {
  storeId: string;
  storeName: string;
  district: string;
  items: { productId: string; productName: string; priceLbp: number; quantity: number }[];
  totalLbp: number;
  coverageCount: number; // how many cart items this store covers
}

export interface SplitStrategy {
  stores: StoreTotal[];
  totalLbp: number;
  savings: number; // vs single best store
}

export interface OptimizerResult {
  singleBest: StoreTotal | null;
  splitStrategy: SplitStrategy | null;
  allStores: StoreTotal[];
}

// ─── Core algorithm ───────────────────────────────────────────────────────────
// For each cart item → find the verified price with the lowest priceLbp.
// Build per-store totals from those cheapest prices.
// Split strategy: for items not covered by the single best store, check next best store.
export function optimizeCart(cartItems: CartItem[]): OptimizerResult {
  if (cartItems.length === 0) return { singleBest: null, splitStrategy: null, allStores: [] };

  const allEntries = getEnrichedPriceEntries().filter(e => e.status === 'verified');

  // For each product in cart, find cheapest entry per store
  const cheapestByProductStore: Record<string, PriceEntry[]> = {};
  for (const item of cartItems) {
    const candidates = allEntries.filter(e => e.productId === item.productId);
    cheapestByProductStore[item.productId] = candidates.sort((a, b) => a.priceLbp - b.priceLbp);
  }

  // Global cheapest per product (any store)
  const globalCheapest: Record<string, PriceEntry> = {};
  for (const item of cartItems) {
    const cheapest = cheapestByProductStore[item.productId]?.[0];
    if (cheapest) globalCheapest[item.productId] = cheapest;
  }

  // Build per-store totals (only stores that carry at least one item)
  const storeMap: Record<string, StoreTotal> = {};
  for (const item of cartItems) {
    const candidates = cheapestByProductStore[item.productId] ?? [];
    for (const entry of candidates) {
      const sid = entry.storeId;
      if (!storeMap[sid]) {
        storeMap[sid] = {
          storeId: sid,
          storeName: entry.store?.name ?? sid,
          district: entry.store?.district ?? '',
          items: [],
          totalLbp: 0,
          coverageCount: 0,
        };
      }
    }
  }

  // For each store, compute what it would cost to buy the FULL cart there
  // (using that store's price if available, otherwise skip item)
  for (const sid of Object.keys(storeMap)) {
    let total = 0;
    let covered = 0;
    const itemDetails: StoreTotal['items'] = [];
    for (const item of cartItems) {
      const entry = cheapestByProductStore[item.productId]?.find(e => e.storeId === sid);
      if (entry) {
        total += entry.priceLbp * item.quantity;
        covered++;
        itemDetails.push({ productId: item.productId, productName: entry.product?.name ?? '', priceLbp: entry.priceLbp, quantity: item.quantity });
      }
    }
    storeMap[sid].totalLbp = total;
    storeMap[sid].coverageCount = covered;
    storeMap[sid].items = itemDetails;
  }

  // All stores sorted by total (full-cart coverage first, then partial)
  const allStores = Object.values(storeMap)
    .filter(s => s.coverageCount > 0)
    .sort((a, b) => {
      if (b.coverageCount !== a.coverageCount) return b.coverageCount - a.coverageCount;
      return a.totalLbp - b.totalLbp;
    });

  // Single best: store with full coverage and lowest total
  const fullCoverage = allStores.filter(s => s.coverageCount === cartItems.length);
  const singleBest = fullCoverage.length > 0
    ? fullCoverage.sort((a, b) => a.totalLbp - b.totalLbp)[0]
    : allStores[0] ?? null;

  // Split strategy: use global cheapest per product regardless of store
  let splitTotal = 0;
  const splitByStore: Record<string, StoreTotal> = {};
  for (const item of cartItems) {
    const entry = globalCheapest[item.productId];
    if (!entry) continue;
    const sid = entry.storeId;
    if (!splitByStore[sid]) {
      splitByStore[sid] = {
        storeId: sid,
        storeName: entry.store?.name ?? sid,
        district: entry.store?.district ?? '',
        items: [],
        totalLbp: 0,
        coverageCount: 0,
      };
    }
    const cost = entry.priceLbp * item.quantity;
    splitByStore[sid].totalLbp += cost;
    splitByStore[sid].coverageCount++;
    splitByStore[sid].items.push({ productId: item.productId, productName: entry.product?.name ?? '', priceLbp: entry.priceLbp, quantity: item.quantity });
    splitTotal += cost;
  }

  const splitStores = Object.values(splitByStore).sort((a, b) => b.coverageCount - a.coverageCount);
  const savings = singleBest ? Math.max(0, singleBest.totalLbp - splitTotal) : 0;

  // Split is only worth showing if it uses >1 store and saves money
  const splitStrategy: SplitStrategy | null =
    splitStores.length > 1 && savings > 0
      ? { stores: splitStores, totalLbp: splitTotal, savings }
      : null;

  return { singleBest, splitStrategy, allStores };
}

// ─── Product lookup helper (for cart UI) ─────────────────────────────────────
export function getAllProducts() {
  return MOCK_PRODUCTS;
}
