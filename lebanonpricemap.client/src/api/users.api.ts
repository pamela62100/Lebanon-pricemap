<<<<<<< HEAD
import axiosClient from './axiosClient';
import type { ApiResponse, User } from '@/types';

export const usersApi = {
  getAll: async () => {
    return axiosClient.get<ApiResponse<User[]>>('/api/users');
  },

  getById: async (id: string | Guid) => {
    return axiosClient.get<ApiResponse<User>>(`/api/users/${id}`);
  },

  updateStatus: async (id: string, status: User['status']) => {
    return axiosClient.put<ApiResponse<User>>(`/api/users/${id}/status`, { status });
=======
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

  deleteSubmissions: async (id: string) => {
    return client.delete(`/users/${id}/submissions`);
  },

  deleteAccount: async (id: string) => {
    return client.delete(`/users/${id}`);
  },

  forgotPassword: async (email: string) => {
    return client.post('/auth/forgot-password', { email });
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
  },

  getProfile: async () => {
    return axiosClient.get<ApiResponse<User>>('/api/users/profile');
  }
};
