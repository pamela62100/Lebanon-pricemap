import type { PriceEntry } from '@/types';
import { getEnrichedPriceEntries, MOCK_PRODUCTS } from '@/api/mockData';

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
  coverageCount: number;
}

export interface SplitStrategy {
  stores: StoreTotal[];
  totalLbp: number;
  savings: number;
}

export interface OptimizerResult {
  singleBest: StoreTotal | null;
  splitStrategy: SplitStrategy | null;
  allStores: StoreTotal[];
}

export function optimizeCart(cartItems: CartItem[]): OptimizerResult {
  if (cartItems.length === 0) {
    return { singleBest: null, splitStrategy: null, allStores: [] };
  }

  const allEntries = getEnrichedPriceEntries().filter((entry) => entry.status === 'verified');

  const cheapestByProductStore: Record<string, PriceEntry[]> = {};

  for (const item of cartItems) {
    const candidates = allEntries
      .filter((entry) => entry.productId === item.productId)
      .sort((a, b) => a.priceLbp - b.priceLbp);

    cheapestByProductStore[item.productId] = candidates;
  }

  const globalCheapest: Record<string, PriceEntry> = {};

  for (const item of cartItems) {
    const cheapest = cheapestByProductStore[item.productId]?.[0];
    if (cheapest) {
      globalCheapest[item.productId] = cheapest;
    }
  }

  const storeMap: Record<string, StoreTotal> = {};

  for (const item of cartItems) {
    const candidates = cheapestByProductStore[item.productId] ?? [];

    for (const entry of candidates) {
      const storeId = entry.storeId;

      if (!storeMap[storeId]) {
        storeMap[storeId] = {
          storeId,
          storeName: entry.store?.name ?? storeId,
          district: entry.store?.district ?? '',
          items: [],
          totalLbp: 0,
          coverageCount: 0,
        };
      }
    }
  }

  for (const storeId of Object.keys(storeMap)) {
    let total = 0;
    let covered = 0;
    const itemDetails: StoreTotal['items'] = [];

    for (const item of cartItems) {
      const entry = cheapestByProductStore[item.productId]?.find(
        (priceEntry) => priceEntry.storeId === storeId
      );

      if (entry) {
        total += entry.priceLbp * item.quantity;
        covered += 1;

        itemDetails.push({
          productId: item.productId,
          productName: entry.product?.name ?? item.productName,
          priceLbp: entry.priceLbp,
          quantity: item.quantity,
        });
      }
    }

    storeMap[storeId].totalLbp = total;
    storeMap[storeId].coverageCount = covered;
    storeMap[storeId].items = itemDetails;
  }

  const allStores = Object.values(storeMap)
    .filter((store) => store.coverageCount > 0)
    .sort((a, b) => {
      if (b.coverageCount !== a.coverageCount) return b.coverageCount - a.coverageCount;
      return a.totalLbp - b.totalLbp;
    });

  const fullCoverageStores = allStores.filter(
    (store) => store.coverageCount === cartItems.length
  );

  const singleBest =
    fullCoverageStores.length > 0
      ? [...fullCoverageStores].sort((a, b) => a.totalLbp - b.totalLbp)[0]
      : allStores[0] ?? null;

  let splitTotal = 0;
  const splitByStore: Record<string, StoreTotal> = {};

  for (const item of cartItems) {
    const entry = globalCheapest[item.productId];
    if (!entry) continue;

    const storeId = entry.storeId;

    if (!splitByStore[storeId]) {
      splitByStore[storeId] = {
        storeId,
        storeName: entry.store?.name ?? storeId,
        district: entry.store?.district ?? '',
        items: [],
        totalLbp: 0,
        coverageCount: 0,
      };
    }

    const itemCost = entry.priceLbp * item.quantity;

    splitByStore[storeId].totalLbp += itemCost;
    splitByStore[storeId].coverageCount += 1;
    splitByStore[storeId].items.push({
      productId: item.productId,
      productName: entry.product?.name ?? item.productName,
      priceLbp: entry.priceLbp,
      quantity: item.quantity,
    });

    splitTotal += itemCost;
  }

  const splitStores = Object.values(splitByStore).sort(
    (a, b) => b.coverageCount - a.coverageCount
  );

  const savings = singleBest ? Math.max(0, singleBest.totalLbp - splitTotal) : 0;

  const splitStrategy =
    splitStores.length > 1 && savings > 0
      ? {
          stores: splitStores,
          totalLbp: splitTotal,
          savings,
        }
      : null;

  return {
    singleBest,
    splitStrategy,
    allStores,
  };
}

export function getAllProducts() {
  return MOCK_PRODUCTS;
}