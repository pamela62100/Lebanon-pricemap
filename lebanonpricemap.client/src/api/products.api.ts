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

  create: async (data: { name: string; nameAr?: string; unit?: string; brand?: string; barcode?: string; category?: string }) => {
    return client.post('/products', data);
  },

  update: async (id: string, data: { name?: string; nameAr?: string; unit?: string; brand?: string; barcode?: string }) => {
    return client.put(`/products/${id}`, data);
  },

  archive: async (id: string) => {
    return client.patch(`/products/${id}/archive`, {});
  },
};