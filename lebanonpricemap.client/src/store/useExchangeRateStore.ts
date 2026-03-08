import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExchangeRateState {
  rateLbpPerUsd: number;
  lastUpdated: string;
  source: string;
  isLoading: boolean;
  fetchRate: () => Promise<void>;
}

const USE_MOCK = true;

export const useExchangeRateStore = create<ExchangeRateState>()(
  persist(
    (set) => ({
      rateLbpPerUsd: 89500,
      lastUpdated: "2025-03-08T07:00:00Z",
      source: "lirarate.org (cached)",
      isLoading: false,

      fetchRate: async () => {
        set({ isLoading: true });
        if (USE_MOCK) {
          await new Promise(r => setTimeout(r, 800));
          // Simulate realistic LBP fluctuation
          const mockRate = 89500 + Math.floor((Math.random() - 0.5) * 500);
          set({
            rateLbpPerUsd: mockRate,
            lastUpdated: new Date().toISOString(),
            source: "lirarate.org (mock)",
            isLoading: false,
          });
          return;
        }
        try {
          // Production: proxy through ASP.NET to avoid CORS
          // GET /api/exchange-rate → your backend fetches lirarate.org
          const res = await fetch('/api/exchange-rate');
          const data = await res.json();
          set({
            rateLbpPerUsd: data.buy ?? data.rate ?? 89500,
            lastUpdated: new Date().toISOString(),
            source: "lirarate.org",
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
