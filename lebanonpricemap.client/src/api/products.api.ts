import type { ApiResponse, Product } from '@/types';
import client from './axiosClient';

export const productsApi = {
  getAll: async (params?: { search?: string; category?: string }) => {
    const response = await client.get('/products', {
      params: {
        query: params?.search,
        category: params?.category,
      },
    });
    return response;
  },

  getById: async (id: string) => {
    const response = await client.get(`/products/${id}`);
    return response;
  },

  getByBarcode: async (barcode: string) => {
    const response = await client.get(`/products/barcode/${barcode}`);
    return response;
  },
};