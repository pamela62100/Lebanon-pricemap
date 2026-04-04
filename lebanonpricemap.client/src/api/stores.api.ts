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
};
