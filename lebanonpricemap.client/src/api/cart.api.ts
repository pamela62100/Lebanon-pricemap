<<<<<<< HEAD
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
=======
import client from './axiosClient';

export const cartApi = {
  getCart: async () => client.get('/cart'),

  addItem: async (data: { productId: string; quantity: number; storeId?: string }) =>
    client.post('/cart/items', data),

  removeItem: async (itemId: string) =>
    client.delete(`/cart/items/${itemId}`),

  updateQuantity: async (itemId: string, quantity: number) =>
    client.patch(`/cart/items/${itemId}`, { quantity }),

  clearCart: async () =>
    client.delete('/cart'),

  optimize: async () =>
    client.get('/cart/optimize'),
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
};
