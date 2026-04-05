import { create } from 'zustand';

interface LocationState {
  lat: number | null;
  lng: number | null;
  city: string;
  permissionStatus: 'unknown' | 'granted' | 'denied';
  isLoading: boolean;
  requestLocation: () => Promise<void>;
  setManualCity: (city: string) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  lat: null,
  lng: null,
  city: 'Beirut',
  permissionStatus: 'unknown',
  isLoading: false,

  requestLocation: async () => {
    set({ isLoading: true });
    if (!navigator.geolocation) {
      set({ permissionStatus: 'denied', isLoading: false });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => set({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        permissionStatus: 'granted',
        isLoading: false,
      }),
      () => set({
        // Fallback to Beirut center if denied
        lat: 33.8938, lng: 35.5018,
        permissionStatus: 'denied',
        isLoading: false,
      })
    );
  },

  setManualCity: (city) => set({ city }),
}));
