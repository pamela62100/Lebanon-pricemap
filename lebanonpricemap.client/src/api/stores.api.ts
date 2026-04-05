<<<<<<< HEAD
import axiosClient from './axiosClient';
import type { ApiResponse, Store } from '@/types';

export const storesApi = {
  getAll: async (params?: { city?: string; district?: string }) => {
    return axiosClient.get<ApiResponse<Store[]>>('/api/stores', { params });
  },

  getById: async (id: string) => {
    return axiosClient.get<ApiResponse<Store>>(`/api/stores/${id}`);
  },

  updateStatus: async (id: string, status: Partial<Store>) => {
    return axiosClient.put<ApiResponse<boolean>>(`/api/stores/${id}/status`, status);
  }
=======
import client from './axiosClient';

export const storesApi = {
  getAll: async (params?: { city?: string }) => {
    return client.get('/stores', { params });
  },

  getById: async (id: string) => {
    return client.get(`/stores/${id}`);
  },

  getMine: async () => {
    return client.get('/stores/mine');
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
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
};
