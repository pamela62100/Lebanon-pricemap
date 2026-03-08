import { useEffect } from 'react';

import { getEnrichedPriceEntries } from '@/api/mockData';
import { useOfflineStore } from '@/store/useOfflineStore';

export function useOfflineSync() {
  const { isOnline, setCached } = useOfflineStore();

  useEffect(() => {
    if (isOnline) {
      const entries = getEnrichedPriceEntries();
      const syncTime = new Date().toISOString();
      localStorage.setItem('wein_price_cache', JSON.stringify(entries));
      localStorage.setItem('wein_last_sync', syncTime);
      setCached(entries.length, syncTime);
    }
  }, [isOnline]);

  const getCachedPrices = () => {
    try {
      const raw = localStorage.getItem('wein_price_cache');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  return { getCachedPrices };
}
