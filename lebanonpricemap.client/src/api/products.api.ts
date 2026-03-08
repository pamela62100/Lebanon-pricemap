import type { ApiResponse, Product } from '@/types';
import { MOCK_PRODUCTS } from './mockData';

export const productsApi = {
  getAll: async (params?: { search?: string; category?: string }) => {
    let products = [...MOCK_PRODUCTS];
    if (params?.search) {
      const q = params.search.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.nameAr.includes(q));
    }
    if (params?.category) products = products.filter(p => p.category === params.category);
    return { data: { success: true, data: products } as ApiResponse<Product[]> };
  },

  getById: async (id: string) => {
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    return { data: { success: true, data: product } as ApiResponse<Product | undefined> };
  },
};
