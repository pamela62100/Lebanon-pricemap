import client from './axiosClient';

export const feedbackApi = {
  getAll: async (params?: { status?: string }) =>
    client.get('/feedback', { params }),

  submit: async (data: { priceEntryId: string; type: string; note?: string }) =>
    client.post('/feedback', data),

  resolve: async (id: string) =>
    client.patch(`/feedback/${id}/resolve`, {}),
};
