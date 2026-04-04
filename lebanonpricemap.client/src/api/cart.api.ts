import axiosClient from './axiosClient';
import type { ApiResponse, PriceEntry } from '@/types';

export const cartApi = {
  getCart: async () => {
    return axiosClient.get<ApiResponse<PriceEntry[]>>('/api/cart');
  },

  addItem: async (productId: string) => {
    return axiosClient.post<ApiResponse<void>>('/api/cart/items', { productId });
  },

  removeItem: async (id: string) => {
    return axiosClient.delete<ApiResponse<void>>(`/api/cart/items/${id}`);
  },

  clearCart: async () => {
    return axiosClient.delete<ApiResponse<void>>('/api/cart');
  },

  optimize: async () => {
    return axiosClient.get<ApiResponse<any>>('/api/cart/optimize');
  }
};
