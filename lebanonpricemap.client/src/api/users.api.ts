import client from './axiosClient';

export const usersApi = {
  getById: async (id: string) => {
    return client.get(`/users/${id}`);
  },

  update: async (id: string, data: {
    name?: string;
    city?: string;
    avatarInitials?: string;
  }) => {
    return client.put(`/users/${id}`, data);
  },

  getNotifications: async (id: string, page = 1, pageSize = 20) => {
    return client.get(`/users/${id}/notifications`, { params: { page, pageSize } });
  },

  updateStatus: async (id: string, status: string) => {
    return client.patch(`/users/${id}/status`, { status });
  },

  forgotPassword: async (email: string) => {
    return client.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string) => {
    return client.post('/auth/reset-password', { token, newPassword });
  },

  deleteMyAccount: async () => {
    return client.delete('/auth/account');
  },
};
