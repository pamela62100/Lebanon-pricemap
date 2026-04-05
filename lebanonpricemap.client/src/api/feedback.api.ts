<<<<<<< HEAD
import axiosClient from './axiosClient';
import type { ApiResponse, Feedback, FeedbackType } from '@/types';

export const feedbackApi = {
  getAll: async (params?: { status?: string }) => {
    return axiosClient.get<ApiResponse<Feedback[]>>('/api/feedback', { params });
  },

  submit: async (data: { priceEntryId: string; type: FeedbackType; note?: string }) => {
    return axiosClient.post<ApiResponse<Feedback>>('/api/feedback', data);
  },

  resolve: async (id: string) => {
    return axiosClient.post<ApiResponse<Feedback>>(`/api/feedback/${id}/resolve`);
  },
=======
import client from './axiosClient';

export const feedbackApi = {
  getAll: async (params?: { status?: string }) =>
    client.get('/feedback', { params }),

  submit: async (data: { priceEntryId: string; type: string; note?: string }) =>
    client.post('/feedback', data),

  resolve: async (id: string) =>
    client.patch(`/feedback/${id}/resolve`, {}),
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
};
