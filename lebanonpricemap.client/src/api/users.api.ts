import type { ApiResponse, User } from '@/types';
import { MOCK_USERS } from './mockData';

export const usersApi = {
  getAll: async () => {
    return { data: { success: true, data: MOCK_USERS } as ApiResponse<User[]> };
  },

  getById: async (id: string) => {
    const user = MOCK_USERS.find(u => u.id === id);
    return { data: { success: true, data: user } as ApiResponse<User | undefined> };
  },

  updateStatus: async (id: string, status: User['status']) => {
    const user = MOCK_USERS.find(u => u.id === id);
    if (user) user.status = status;
    return { data: { success: true, data: user } as ApiResponse<User | undefined> };
  },
};
