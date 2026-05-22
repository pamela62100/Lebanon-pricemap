import client from './axiosClient';

// ─── Catalog API ──────────────────────────────────────────────────────────────
export const catalogApi = {
  getByStore: async (storeId: string) => {
    return client.get(`/catalog/store/${storeId}`);
  },

  getById: async (id: string) => {
    return client.get(`/catalog/${id}`);
  },

  create: async (data: {
    storeId: string;
    productId: string;
    officialPriceLbp: number;
    isInStock?: boolean;
    isPromotion?: boolean;
    promoPriceLbp?: number;
    promoEndsAt?: string | null;
  }) => {
    return client.post('/catalog', data);
  },

  update: async (id: string, data: {
    officialPriceLbp?: number;
    promoPriceLbp?: number;
    promoEndsAt?: string | null;
    isInStock?: boolean;
    isPromotion?: boolean;
  }) => {
    return client.put(`/catalog/${id}`, data);
  },

  delete: async (id: string) => {
    return client.delete(`/catalog/${id}`);
  },

  bulkUpload: async (storeId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return client.post(`/catalog/upload?storeId=${storeId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getAudit: async (id: string) => {
    return client.get(`/catalog/${id}/audit`);
  },

  getInsights: async () => {
    return client.get('/catalog/insights');
  },
};
