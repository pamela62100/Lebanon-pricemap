import { useEffect } from 'react';
import { pricesApi } from '@/api/prices.api';
import { useOfflineStore } from '@/store/useOfflineStore';

export function useOfflineSync() {
  const { isOnline, setCached } = useOfflineStore();

  useEffect(() => {
    if (isOnline) {
      pricesApi.search({ verifiedOnly: true }).then((res) => {
        const data = res.data?.data ?? res.data;
        const entries = Array.isArray(data) ? data : [];
        const syncTime = new Date().toISOString();
        localStorage.setItem('wein_price_cache', JSON.stringify(entries));
        localStorage.setItem('wein_last_sync', syncTime);
        setCached(entries.length, syncTime);
      }).catch(() => {});
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
