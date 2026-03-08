import { create } from 'zustand';

interface OfflineState {
  isOnline: boolean;
  lastSyncAt: string | null;
  cachedPriceCount: number;
  setOnline: (online: boolean) => void;
  setCached: (count: number, syncTime: string) => void;
}

export const useOfflineStore = create<OfflineState>((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  lastSyncAt: typeof localStorage !== 'undefined'
    ? localStorage.getItem('wein_last_sync')
    : null,
  cachedPriceCount: 0,
  setOnline: (online) => set({ isOnline: online }),
  setCached: (count, syncTime) => set({ cachedPriceCount: count, lastSyncAt: syncTime }),
}));

// Call once in main.tsx — sets up browser online/offline events
export function initOfflineListeners() {
  const { setOnline } = useOfflineStore.getState();
  window.addEventListener('online',  () => setOnline(true));
  window.addEventListener('offline', () => setOnline(false));
}
