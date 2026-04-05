import client from './axiosClient';
import type { ApiResponse, PriceEntry } from '@/types';

export const pricesApi = {
  search: async (params: { query?: string; city?: string; sort?: string; verifiedOnly?: boolean }) => {
    return client.get<ApiResponse<PriceEntry[]>>('/prices/search', { params });
  },

  getByProduct: async (productId: string) => {
    return client.get<ApiResponse<PriceEntry[]>>(`/prices/product/${productId}`);
  },

  getById: async (id: string) => {
    return client.get<ApiResponse<PriceEntry>>(`/prices/${id}`);
  },

  getByUser: async (userId: string) => {
    return client.get<ApiResponse<PriceEntry[]>>(`/prices/user/${userId}`);
  },

  submit: async (data: { productId: string; storeId: string; priceLbp: number; receiptImageBase64?: string }) => {
    return client.post<ApiResponse<PriceEntry>>('/prices', data);
  },

  vote: async (id: string, value: 1 | -1) => {
    return client.post(`/prices/${id}/vote`, { value });
  },

  getHistory: async (productId: string) => {
    return client.get<ApiResponse<{ date: string; price: number; storeName: string }[]>>(
      `/prices/product/${productId}/history`
    );
  },
};
