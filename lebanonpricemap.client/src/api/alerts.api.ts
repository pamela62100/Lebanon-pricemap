<<<<<<< HEAD
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
=======
import client from './axiosClient';

export const alertsApi = {
  // GET /api/alerts — get all alerts for the logged-in user
  getAll: async () => {
    return client.get('/alerts');
  },

  // POST /api/alerts — create a new price alert
  create: async (data: {
    productId: string;
    targetPriceLbp: number;
    verifiedOnly?: boolean;
  }) => {
    return client.post('/alerts', data);
  },

  // DELETE /api/alerts/{id} — delete an alert
  delete: async (id: string) => {
    return client.delete(`/alerts/${id}`);
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
  },
};
