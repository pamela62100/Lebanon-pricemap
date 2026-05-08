import client from './axiosClient';

export const discrepancyApi = {
  submit: async (data: {
    storeId: string;
    productId: string;
    catalogItemId?: string;
    reportType: 'price_higher' | 'price_lower' | 'out_of_stock' | 'wrong_unit' | 'other';
    observedPriceLbp?: number;
    note?: string;
  }) => client.post('/discrepancy', data),

  getPending: async () => client.get('/discrepancy/pending'),

  getByStore: async (storeId: string) => client.get(`/discrepancy/store/${storeId}`),

  approve: async (id: string, data: { approvedPrice?: number; note?: string }) =>
    client.patch(`/discrepancy/${id}/approve`, data),

  reject: async (id: string, data: { note?: string }) =>
    client.patch(`/discrepancy/${id}/reject`, data),
};
