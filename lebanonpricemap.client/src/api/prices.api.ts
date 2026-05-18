import client from './axiosClient';
import type { ApiResponse, PriceEntry } from '@/types';

export const pricesApi = {
  search: async (params: { query?: string; city?: string; sort?: string; verifiedOnly?: boolean; inStockOnly?: boolean }) => {
    return client.get<ApiResponse<PriceEntry[]>>('/prices/search', { params });
  },

  getByProduct: async (productId: string) => {
    return client.get<ApiResponse<PriceEntry[]>>(`/prices/product/${productId}`);
  },

  getById: async (id: string) => {
    return client.get<ApiResponse<PriceEntry>>(`/prices/${id}`);
  },

  vote: async (id: string, value: 1 | -1) => {
    return client.post(`/prices/${id}/vote`, { value });
  },

  bulkSubmit: async (data: { rows: { productName?: string; barcode?: string; priceLbp: number; unit?: string }[] }) => {
    return client.post<ApiResponse<{ recordsReceived: number; recordsProcessed: number; recordsFailed: number; status: string; message: string }>>('/prices/bulk', data);
  },

  getHistory: async (productId: string) => {
    return client.get<ApiResponse<{ date: string; price: number; storeName: string }[]>>(
      `/prices/product/${productId}/history`
    );
  },
};
