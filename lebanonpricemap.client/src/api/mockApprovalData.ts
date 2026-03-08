import type { ApprovalRequest } from '@/types';
import { MOCK_USERS } from '@/api/mockData';

// ─── Enrich helper ────────────────────────────────────────────────────────────
function enrichRequest(r: ApprovalRequest): ApprovalRequest {
  const user = MOCK_USERS.find(u => u.id === r.requestedBy);
  return {
    ...r,
    requester: user
      ? { id: user.id, name: user.name, avatarInitials: user.avatarInitials, trustScore: user.trustScore, role: user.role }
      : undefined,
  };
}

// ─── Mock Approval Requests ───────────────────────────────────────────────────
export const MOCK_APPROVAL_REQUESTS: ApprovalRequest[] = ([
  {
    id: 'ar1',
    requestedBy: 'u1',
    action: 'account:delete',
    label: 'Delete Account',
    payload: { reason: 'I no longer want to participate', userId: 'u1' },
    status: 'pending' as const,
    reviewedBy: null,
    reviewNote: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    resolvedAt: null,
  },
  {
    id: 'ar2',
    requestedBy: 'u2',
    action: 'bulk:delete',
    label: 'Bulk Delete Price Submissions',
    payload: { count: 6, reason: 'Submitted incorrect prices by mistake', priceIds: ['pe5', 'pe6', 'pe7'] },
    status: 'pending' as const,
    reviewedBy: null,
    reviewNote: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    resolvedAt: null,
  },
  {
    id: 'ar3',
    requestedBy: 'u3',
    action: 'account:delete',
    label: 'Delete Account',
    payload: { reason: 'Privacy concerns', userId: 'u3' },
    status: 'approved' as const,
    reviewedBy: 'u5',
    reviewNote: 'Verified identity. Approved deletion per user request.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'ar4',
    requestedBy: 'u1',
    action: 'bulk:delete',
    label: 'Bulk Delete Price Submissions',
    payload: { count: 2, reason: 'Old data, no longer accurate', priceIds: ['pe1', 'pe2'] },
    status: 'rejected' as const,
    reviewedBy: 'u5',
    reviewNote: 'Cannot delete verified submissions — these are part of the price history.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
  },
] as ApprovalRequest[]).map(enrichRequest);
