import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ApprovalRequest, ApprovalStatus } from '@/types';
import { MOCK_APPROVAL_REQUESTS } from '@/api/mockApprovalData';

interface ApprovalState {
  requests: ApprovalRequest[];
  // Derived
  pendingCount: () => number;
  // Actions
  submitRequest: (action: string, payload: Record<string, unknown>) => void;
  approveRequest: (id: string, note?: string) => void;
  rejectRequest: (id: string, note?: string) => void;
  setStatus: (id: string, status: ApprovalStatus, reviewNote?: string) => void;
}

export const useApprovalStore = create<ApprovalState>()(
  persist(
    (set, get) => ({
      requests: MOCK_APPROVAL_REQUESTS,

      pendingCount: () => get().requests.filter(r => r.status === 'pending').length,

      submitRequest: (action, payload) => {
        const newRequest: ApprovalRequest = {
          id: `ar${Date.now()}`,
          requestedBy: (payload.requestedBy as string) ?? 'unknown',
          action,
          label: (payload.label as string) ?? action,
          payload,
          status: 'pending',
          reviewedBy: null,
          reviewNote: null,
          createdAt: new Date().toISOString(),
          resolvedAt: null,
        };
        set(state => ({ requests: [newRequest, ...state.requests] }));
      },

      approveRequest: (id, note = '') => {
        get().setStatus(id, 'approved', note);
      },

      rejectRequest: (id, note = '') => {
        get().setStatus(id, 'rejected', note);
      },

      setStatus: (id, status, reviewNote = '') => {
        set(state => ({
          requests: state.requests.map(r =>
            r.id === id
              ? { ...r, status, reviewedBy: 'admin', reviewNote, resolvedAt: new Date().toISOString() }
              : r
          ),
        }));
      },
    }),
    { name: 'rakis_approvals' }
  )
);
