import client from './axiosClient';

export const storesApi = {
  getAll: async (params?: { city?: string }) => {
    return client.get('/stores', { params });
  },

  getById: async (id: string) => {
    return client.get(`/stores/${id}`);
  },

  update: async (id: string, data: {
    name?: string;
    city?: string;
    district?: string;
    region?: string;
    latitude?: number;
    longitude?: number;
    chain?: string;
    internalRateLbp?: number;
  }) => {
    return client.put(`/stores/${id}`, data);
  },

  updatePower: async (id: string, powerStatus: string) => {
    return client.patch(`/stores/${id}/power`, { powerStatus });
  },

  updateStatus: async (id: string, status: string) => {
    return client.patch(`/stores/${id}/status`, { status });
  },
};
