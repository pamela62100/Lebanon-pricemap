import client from './axiosClient';
import type { ApiResponse, PriceEntry } from '@/types';

export const pricesApi = {
  search: async (params: { query?: string; city?: string; sort?: string; verifiedOnly?: boolean; submittedBy?: string }) => {
    return client.get<ApiResponse<PriceEntry[]>>('/api/prices/search', { params });
  },

  getByProduct: async (productId: string) => {
    return client.get<ApiResponse<PriceEntry[]>>(`/api/prices/product/${productId}`);
  },

  getById: async (id: string) => {
    return client.get<ApiResponse<PriceEntry>>(`/api/prices/${id}`);
  },

  getHistory: async (productId: string, storeId?: string) => {
    return client.get<ApiResponse<any[]>>(`/api/prices/product/${productId}/history`, { params: { storeId } });
  },

  getMySubmissions: async () => {
    return client.get<ApiResponse<PriceEntry[]>>('/api/prices/my-submissions');
  },

  submit: async (data: { productId: string; storeId: string; priceLbp: number; isPromotion?: boolean; promoEndsAt?: string; note?: string }) => {
    return client.post<ApiResponse<PriceEntry>>('/api/prices', data);
  },

  vote: async (id: string, value: number) => {
    return client.post<ApiResponse<void>>(`/api/prices/${id}/vote`, { value });
  }
};
