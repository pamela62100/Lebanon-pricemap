import client from './axiosClient';
import { MOCK_MISSING_PRODUCT_REQUESTS } from './mockCatalogData';
import type { MissingProductRequest } from '@/types/catalog.types';

// ─── Catalog API ──────────────────────────────────────────────────────────────
export const catalogApi = {
  getByStore: async (storeId: string) => {
    return client.get(`/catalog/store/${storeId}`);
  },

  getById: async (id: string) => {
    return client.get(`/catalog/${id}`);
  },

  create: async (data: {
    storeId: string;
    productId: string;
    officialPriceLbp: number;
    isInStock?: boolean;
    isPromotion?: boolean;
    promoPriceLbp?: number;
    promoEndsAt?: string | null;
  }) => {
    return client.post('/catalog', data);
  },

  update: async (id: string, data: {
    officialPriceLbp?: number;
    promoPriceLbp?: number;
    promoEndsAt?: string | null;
    isInStock?: boolean;
    isPromotion?: boolean;
  }) => {
    return client.put(`/catalog/${id}`, data);
  },

  delete: async (id: string) => {
    return client.delete(`/catalog/${id}`);
  },

  bulkUpload: async (storeId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return client.post(`/catalog/upload?storeId=${storeId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getAudit: async (id: string) => {
    return client.get(`/catalog/${id}/audit`);
  },
};

// ─── Discrepancy API ──────────────────────────────────────────────────────────
export const discrepancyApi = {
  submit: async (data: {
    catalogItemId: string;
    storeId: string;
    productId: string;
    reportType: string;
    observedPriceLbp?: number;
    note?: string;
  }) => {
    return client.post('/discrepancy', data);
  },

  getPending: async () => {
    return client.get('/discrepancy/pending');
  },

  getByStore: async (storeId: string) => {
    return client.get(`/discrepancy/store/${storeId}`);
  },

  approve: async (id: string, data: { approvedPrice?: number; note?: string }) => {
    return client.patch(`/discrepancy/${id}/approve`, data);
  },

  reject: async (id: string, data: { note: string }) => {
    return client.patch(`/discrepancy/${id}/reject`, data);
  },
};

// ─── Missing Product Request API (no backend yet — local state) ───────────────
let missingProductRequests = [...MOCK_MISSING_PRODUCT_REQUESTS];

export const missingProductApi = {
  getAll(): MissingProductRequest[] {
    return [...missingProductRequests].sort(
      (a, b) => b.requesterTrustScore - a.requesterTrustScore
    );
  },

  getPending(): MissingProductRequest[] {
    return missingProductRequests.filter(r => r.status === 'pending');
  },

  submit(req: Omit<MissingProductRequest, 'id' | 'status' | 'createdAt'>): MissingProductRequest {
    const newReq: MissingProductRequest = {
      ...req,
      id: `mp${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    missingProductRequests = [newReq, ...missingProductRequests];
    return newReq;
  },

  forward(id: string, note?: string): boolean {
    const idx = missingProductRequests.findIndex(r => r.id === id);
    if (idx === -1) return false;
    missingProductRequests[idx] = {
      ...missingProductRequests[idx],
      status: 'forwarded',
      reviewNote: note,
      resolvedAt: new Date().toISOString(),
    };
    return true;
  },

  decline(id: string, note?: string): boolean {
    const idx = missingProductRequests.findIndex(r => r.id === id);
    if (idx === -1) return false;
    missingProductRequests[idx] = {
      ...missingProductRequests[idx],
      status: 'declined',
      reviewNote: note,
      resolvedAt: new Date().toISOString(),
    };
    return true;
  },
};
