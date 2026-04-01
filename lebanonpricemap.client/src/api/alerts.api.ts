import client from './axiosClient';

export const alertsApi = {
  // GET /api/alerts — get all alerts for the logged-in user
  getAll: async () => {
    return client.get('/alerts');
  },

  // POST /api/alerts — create a new price alert
  create: async (data: {
    productId: string;
    targetPriceLbp: number;
    verifiedOnly?: boolean;
  }) => {
    return client.post('/alerts', data);
  },

  // DELETE /api/alerts/{id} — delete an alert
  delete: async (id: string) => {
    return client.delete(`/alerts/${id}`);
  },
};
