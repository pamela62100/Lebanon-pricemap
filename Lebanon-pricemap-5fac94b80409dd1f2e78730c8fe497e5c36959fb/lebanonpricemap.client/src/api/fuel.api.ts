import client from './axiosClient';

export const fuelApi = {
  // GET /api/fuel — get current nationwide official fuel prices
  getPrices: async () => {
    return client.get('/fuel');
  },

  // GET /api/fuel/stations?city=Beirut — get gas stations and live availability
  getStations: async (params?: { city?: string }) => {
    return client.get('/fuel/stations', { params });
  },

  // POST /api/fuel/stations/{id}/report — report a station's queue or stock status
  reportStation: async (
    stationId: string,
    data: {
      fuelType: string;
      isOpen: boolean;
      hasStock: boolean;
      queueMinutes?: number;
      queueDepth?: number;
      isRationed?: boolean;
      limitAmountLbp?: number;
    }
  ) => {
    return client.post(`/fuel/stations/${stationId}/report`, data);
  },
};
