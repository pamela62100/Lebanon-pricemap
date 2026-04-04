import axiosClient from './axiosClient';
import type { ApiResponse } from '@/types';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'price_drop' | 'discrepancy_resolved' | 'system' | 'welcome';
  read: boolean;
  createdAt: string;
}

export const notificationsApi = {
  getAll: async () => {
    return axiosClient.get<ApiResponse<Notification[]>>('/api/notifications');
  },

  markRead: async (id: string) => {
    return axiosClient.post<ApiResponse<void>>(`/api/notifications/${id}/read`);
  },

  markAllRead: async () => {
    return axiosClient.post<ApiResponse<void>>('/api/notifications/read-all');
  },

  delete: async (id: string) => {
    return axiosClient.delete<ApiResponse<void>>(`/api/notifications/${id}`);
  }
};
