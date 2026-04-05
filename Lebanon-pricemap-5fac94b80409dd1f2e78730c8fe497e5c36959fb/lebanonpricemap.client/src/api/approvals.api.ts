import client from './axiosClient';

export const approvalsApi = {
  getAll: async (status?: string) =>
    client.get('/approvals', { params: status ? { status } : undefined }),

  getPendingCount: async () =>
    client.get('/approvals/pending-count'),

  create: async (data: { action: string; label: string; payload?: string }) =>
    client.post('/approvals', data),

  approve: async (id: string, note?: string) =>
    client.patch(`/approvals/${id}/approve`, { note }),

  reject: async (id: string, note?: string) =>
    client.patch(`/approvals/${id}/reject`, { note }),
};
