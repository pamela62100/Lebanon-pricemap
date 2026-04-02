import { create } from 'zustand';
import { fuelApi } from '@/api/fuel.api';

interface FuelPrice {
  id: string;
  fuelType: string;
  officialPriceLbp: number;
  reportedPriceLbp?: number;
  effectiveFrom: string;
  effectiveTo?: string;
  source?: string;
}

interface StationReport {
  storeId: string;
  storeName: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  powerStatus?: string;
  isOpen?: boolean;
  hasStock?: boolean;
  queueMinutes?: number;
  queueDepth?: number;
  isRationed?: boolean;
  lastReportedAt?: string;
}

interface FuelState {
  prices: FuelPrice[];
  stations: StationReport[];
  isLoading: boolean;
  fetchPrices: () => Promise<void>;
  fetchStations: (city?: string) => Promise<void>;
  reportStation: (stationId: string, data: {
    fuelType: string;
    isOpen: boolean;
    hasStock: boolean;
    queueMinutes?: number;
    queueDepth?: number;
    isRationed?: boolean;
    limitAmountLbp?: number;
  }) => Promise<void>;
  getPriceByType: (fuelType: string) => FuelPrice | undefined;
  getStationsByType: (fuelType: string) => StationReport[];
}

export const useFuelStore = create<FuelState>((set, get) => ({
  prices: [],
  stations: [],
  isLoading: false,

  fetchPrices: async () => {
    set({ isLoading: true });
    try {
      const res = await fuelApi.getPrices();
      const data = res.data?.data ?? res.data;
      set({ prices: Array.isArray(data) ? data : [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStations: async (city) => {
    set({ isLoading: true });
    try {
      const res = await fuelApi.getStations(city ? { city } : undefined);
      const data = res.data?.data ?? res.data;
      set({ stations: Array.isArray(data) ? data : [] });
    } finally {
      set({ isLoading: false });
    }
  },

  reportStation: async (stationId, data) => {
    const res = await fuelApi.reportStation(stationId, data);
    const updated: StationReport = res.data?.data ?? res.data;
    set(state => ({
      stations: state.stations.some(s => s.storeId === updated.storeId)
        ? state.stations.map(s => s.storeId === updated.storeId ? updated : s)
        : [updated, ...state.stations],
    }));
  },

  getPriceByType: (fuelType) =>
    get().prices.find(p => p.fuelType === fuelType),

  getStationsByType: (fuelType) =>
    get().stations.filter(s => {
      // backend doesn't filter by fuelType per station in the response,
      // so we return all stations when a type is selected
      return true;
    }),
}));
