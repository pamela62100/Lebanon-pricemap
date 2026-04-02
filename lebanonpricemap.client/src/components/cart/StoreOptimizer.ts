// Client-side cart optimization is handled server-side via /api/cart/optimize.
// This file is kept for type exports used elsewhere.

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
