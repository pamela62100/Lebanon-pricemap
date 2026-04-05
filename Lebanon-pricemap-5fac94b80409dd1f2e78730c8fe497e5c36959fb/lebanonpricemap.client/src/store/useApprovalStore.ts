import { create } from 'zustand';
import { approvalsApi } from '@/api/approvals.api';

interface ApprovalRequest {
  id: string;
  requestedBy: string;
  reviewedBy?: string | null;
  action: string;
  label: string;
  payload: string;
  status: string;
  reviewNote?: string | null;
  createdAt: string;
  resolvedAt?: string | null;
}

interface ApprovalState {
  requests: ApprovalRequest[];
  isLoading: boolean;
  pendingCount: () => number;
  fetchAll: (status?: string) => Promise<void>;
  submitRequest: (action: string, label: string, payload?: string) => Promise<void>;
  approveRequest: (id: string, note?: string) => Promise<void>;
  rejectRequest: (id: string, note?: string) => Promise<void>;
}

export const useApprovalStore = create<ApprovalState>((set, get) => ({
  requests: [],
  isLoading: false,

  pendingCount: () => get().requests.filter(r => r.status === 'pending').length,

  fetchAll: async (status) => {
    set({ isLoading: true });
    try {
      const res = await approvalsApi.getAll(status);
      const data = res.data?.data ?? res.data;
      set({ requests: Array.isArray(data) ? data : [] });
    } finally {
      set({ isLoading: false });
    }
  },

  submitRequest: async (action, label, payload = '{}') => {
    const res = await approvalsApi.create({ action, label, payload });
    const created: ApprovalRequest = res.data?.data ?? res.data;
    set(state => ({ requests: [created, ...state.requests] }));
  },

  approveRequest: async (id, note) => {
    await approvalsApi.approve(id, note);
    set(state => ({
      requests: state.requests.map(r =>
        r.id === id ? { ...r, status: 'approved', reviewNote: note ?? null, resolvedAt: new Date().toISOString() } : r
      ),
    }));
  },

  rejectRequest: async (id, note) => {
    await approvalsApi.reject(id, note);
    set(state => ({
      requests: state.requests.map(r =>
        r.id === id ? { ...r, status: 'rejected', reviewNote: note ?? null, resolvedAt: new Date().toISOString() } : r
      ),
    }));
  },
}));
