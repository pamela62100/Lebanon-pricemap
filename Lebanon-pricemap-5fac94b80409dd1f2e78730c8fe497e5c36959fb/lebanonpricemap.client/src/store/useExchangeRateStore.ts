import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExchangeRateState {
  rateLbpPerUsd: number;
  lastUpdated: string;
  source: string;
  isLoading: boolean;
  fetchRate: () => Promise<void>;
}

export const useExchangeRateStore = create<ExchangeRateState>()(
  persist(
    (set) => ({
      rateLbpPerUsd: 89500,
      lastUpdated: "2025-03-08T07:00:00Z",
      source: "database (cached)",
      isLoading: false,

      fetchRate: async () => {
        set({ isLoading: true });
        try {
          const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5223/api';
          const res = await fetch(`${base}/settings/exchange-rate`);
          const json = await res.json();
          const rate = json?.data?.rate ?? 89500;
          set({
            rateLbpPerUsd: Number(rate),
            lastUpdated: new Date().toISOString(),
            source: json?.data?.source ?? "database",
            isLoading: false,
          });
        } catch {
          // Silent fallback — never crash the app over a rate update
          set({ isLoading: false });
        }
      },
    }),
    { name: 'rakis_rate_storage' }
  )
);
