import client from './axiosClient';
import type { ApiResponse, PriceEntry } from '@/types';

export const pricesApi = {
<<<<<<< HEAD
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
=======
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
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
};
