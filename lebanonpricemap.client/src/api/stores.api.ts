import client from './axiosClient';

export const storesApi = {
  getAll: async (params?: { city?: string; includeAll?: boolean }) => {
    return client.get('/stores', { params });
  },

  getById: async (id: string) => {
    return client.get(`/stores/${id}`);
  },

  getMine: async () => {
    return client.get('/stores/mine');
  },

  createMine: async (data: {
    name: string;
    chain?: string;
    city: string;
    district?: string;
    region?: string;
    latitude?: number;
    longitude?: number;
  }) => {
    return client.post('/stores/mine', data);
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

  getApiKeys: async () => client.get('/stores/mine/api-keys'),

  createApiKey: async (keyLabel: string) => client.post('/stores/mine/api-keys', { keyLabel }),

  revokeApiKey: async (keyId: string) => client.delete(`/stores/mine/api-keys/${keyId}`),

  getSyncRuns: async () => client.get('/stores/mine/sync-runs'),
};
