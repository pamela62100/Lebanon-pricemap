import type { ApiResponse, Feedback, FeedbackType } from '@/types';
import { getEnrichedFeedback, MOCK_FEEDBACK } from './mockData';

export const feedbackApi = {
  getAll: async (params?: { status?: string }) => {
    let feedback = getEnrichedFeedback();
    if (params?.status) feedback = feedback.filter(f => f.status === params.status);
    return { data: { success: true, data: feedback } as ApiResponse<Feedback[]> };
  },

  submit: async (data: { priceEntryId: string; type: FeedbackType; note?: string }) => {
    const fb: Feedback = {
      id: `fb${Date.now()}`, ...data, submittedBy: 'u1', note: data.note || null,
      status: 'open', createdAt: new Date().toISOString(),
    };
    MOCK_FEEDBACK.push(fb);
    return { data: { success: true, data: fb } as ApiResponse<Feedback> };
  },

  resolve: async (id: string) => {
    const fb = MOCK_FEEDBACK.find(f => f.id === id);
    if (fb) fb.status = 'resolved';
    return { data: { success: true, data: fb } as ApiResponse<Feedback | undefined> };
  },
};
