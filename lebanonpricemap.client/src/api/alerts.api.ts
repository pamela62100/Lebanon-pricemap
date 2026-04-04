import axiosClient from './axiosClient';
import type { ApiResponse } from '@/types';

export interface AlertRequest {
  productId: string;
  thresholdLbp: number;
  regions: string[];
  verifiedOnly: boolean;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  thresholdLbp: number;
  regions: string[];
  verifiedOnly: boolean;
  active: boolean;
  createdAt: string;
}

export const alertsApi = {
  getAll: async () => {
    return axiosClient.get<ApiResponse<PriceAlert[]>>('/api/alerts');
  },

  create: async (data: AlertRequest) => {
    return axiosClient.post<ApiResponse<PriceAlert>>('/api/alerts', data);
  },

  toggle: async (id: string) => {
    return axiosClient.post<ApiResponse<PriceAlert>>(`/api/alerts/${id}/toggle`);
  },

  delete: async (id: string) => {
    return axiosClient.delete<ApiResponse<void>>(`/api/alerts/${id}`);
  },
};
