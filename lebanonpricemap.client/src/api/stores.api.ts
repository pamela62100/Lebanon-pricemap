import type { ApiResponse, Store } from '@/types';
import { MOCK_STORES } from './mockData';

export const storesApi = {
  getAll: async (params?: { city?: string; district?: string }) => {
    let stores = [...MOCK_STORES];
    if (params?.city) stores = stores.filter(s => s.city === params.city);
    if (params?.district) stores = stores.filter(s => s.district === params.district);
    return { data: { success: true, data: stores } as ApiResponse<Store[]> };
  },

  getById: async (id: string) => {
    const store = MOCK_STORES.find(s => s.id === id);
    return { data: { success: true, data: store } as ApiResponse<Store | undefined> };
  },
};
