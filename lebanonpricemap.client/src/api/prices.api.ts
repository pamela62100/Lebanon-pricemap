import client from './axiosClient';
import type { ApiResponse, PriceEntry } from '@/types';
import { getEnrichedPriceEntries } from './mockData';

const USE_MOCK = false;

export const pricesApi = {
  search: async (params: { query?: string; city?: string; sort?: string; verifiedOnly?: boolean }) => {
    if (USE_MOCK) {
      let entries = getEnrichedPriceEntries();
      if (params.query) {
        const q = params.query.toLowerCase();
        entries = entries.filter(e => e.product?.name.toLowerCase().includes(q) || e.store?.name.toLowerCase().includes(q));
      }
      if (params.verifiedOnly) entries = entries.filter(e => e.status === 'verified');
      if (params.sort === 'price') entries.sort((a, b) => a.priceLbp - b.priceLbp);
      return { data: { success: true, data: entries } };
    }
    return client.get<ApiResponse<PriceEntry[]>>('/prices/search', { params });
  },

  getByProduct: async (productId: string) => {
    if (USE_MOCK) {
      const entries = getEnrichedPriceEntries().filter(e => e.productId === productId);
      return { data: { success: true, data: entries } };
    }
    return client.get<ApiResponse<PriceEntry[]>>(`/prices/product/${productId}`);
  },

  getById: async (id: string) => {
    if (USE_MOCK) {
      const entry = getEnrichedPriceEntries().find(e => e.id === id);
      return { data: { success: true, data: entry } };
    }
    return client.get<ApiResponse<PriceEntry>>(`/prices/${id}`);
  },

  submit: async (data: { productId: string; storeId: string; priceLbp: number; receiptImageBase64?: string }) => {
    if (USE_MOCK) {
      const entry: PriceEntry = {
        id: `pe${Date.now()}`,
        productId: data.productId,
        storeId: data.storeId,
        priceLbp: data.priceLbp,
        status: 'pending',
        submittedBy: 'u1',
        submitterTrustScore: 87,
        receiptImageUrl: null,
        isPromotion: false,
        promoEndsAt: null,
        createdAt: new Date().toISOString(),
        verifiedAt: null,
        verifiedBy: null,
        upvotes: 0,
        downvotes: 0,
        source: 'official'
      };
      return { data: { success: true, data: entry } };
    }
    return client.post<ApiResponse<PriceEntry>>('/prices', data);
  },
};
