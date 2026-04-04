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
};
