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
  },

  getProfile: async () => {
    return axiosClient.get<ApiResponse<User>>('/api/users/profile');
  }
};
