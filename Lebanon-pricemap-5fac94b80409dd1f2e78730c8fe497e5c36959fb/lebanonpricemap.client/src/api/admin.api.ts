import client from './axiosClient';

export const adminApi = {
  getStats: async () =>
    client.get('/admin/stats'),

  getUsers: async (params?: { search?: string; role?: string }) =>
    client.get('/admin/users', { params }),

  createUser: async (data: { name: string; email: string; password: string; role: string; city?: string }) =>
    client.post('/admin/users', data),

  updateUserStatus: async (id: string, status: string) =>
    client.patch(`/admin/users/${id}/status`, { status }),

  getAuditLogs: async () =>
    client.get('/admin/audit-logs'),

  getAnomalies: async (status?: string) =>
    client.get('/admin/anomalies', { params: { status } }),

  getOnboarding: async (status?: string) =>
    client.get('/admin/onboarding', { params: { status } }),

  updateOnboardingStep: async (id: string, data: { step: number; adminNotes?: string; status?: string }) =>
    client.patch(`/admin/onboarding/${id}/step`, data),
};
