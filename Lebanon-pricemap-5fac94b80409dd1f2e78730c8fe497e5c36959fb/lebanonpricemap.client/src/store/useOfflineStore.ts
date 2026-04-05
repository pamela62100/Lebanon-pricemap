import { create } from 'zustand';

interface OfflineState {
  isOnline: boolean;
  lastSyncAt: string | null;
  cachedCount: number;
  setOnline: (val: boolean) => void;
  setLastSync: () => void;
  setCached: (count: number, syncTime: string) => void; // ← ADD
}

export const useOfflineStore = create<OfflineState>((set) => ({
  isOnline: navigator.onLine,
  lastSyncAt: null,
  cachedCount: 0,
  setOnline: (val: boolean) => set({ isOnline: val }),
  setLastSync: () => set({ lastSyncAt: new Date().toISOString() }),
  setCached: (count: number, syncTime: string) => set({ cachedCount: count, lastSyncAt: syncTime }), // ← ADD
}));

export function initOfflineListeners() {
  const store = useOfflineStore.getState();

  window.addEventListener('online', () => {
    store.setOnline(true);
    store.setLastSync();
  });

  window.addEventListener('offline', () => {
    store.setOnline(false);
  });
}