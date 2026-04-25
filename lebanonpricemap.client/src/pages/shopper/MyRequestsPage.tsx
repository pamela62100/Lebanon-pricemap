import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApprovalStore } from '@/store/useApprovalStore';
import { useAuthStore } from '@/store/useAuthStore';
import { timeAgo, cn } from '@/lib/utils';
import type { ApprovalStatus } from '@/types';

function tryParsePayload(payload: unknown): Record<string, unknown> {
  if (typeof payload === 'object' && payload !== null) return payload as Record<string, unknown>;
  try { return JSON.parse(payload as string) ?? {}; } catch { return {}; }
}

const STATUS_CONFIG: Record<
  ApprovalStatus,
  { label: string; icon: string; classes: string }
> = {
  pending: {
    label: 'Pending Review',
    icon: 'hourglass_top',
    classes: 'bg-amber-400/10 text-amber-500 border-amber-400/30',
  },
  approved: {
    label: 'Approved',
    icon: 'check_circle',
    classes: 'bg-green-500/10 text-green-500 border-green-500/30',
  },
  rejected: {
    label: 'Rejected',
    icon: 'cancel',
    classes: 'bg-red-500/10 text-red-500 border-red-500/30',
  },
};

export function MyRequestsPage() {
  const user = useAuthStore((state) => state.user);
  const { requests, fetchAll } = useApprovalStore();

  useEffect(() => { fetchAll(); }, []);

  const myRequests = requests.filter((request) => request.requestedBy === user?.id);

  return (
    <div className="px-6 lg:px-8 py-8 animate-page">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main mb-1">My Requests</h1>
        <p className="text-sm text-text-muted">
          Track the status of actions waiting for admin approval.
        </p>
      </div>

      {myRequests.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-5xl block mb-3 text-text-muted opacity-20">
            inbox
          </span>
          <p className="font-semibold text-text-muted">No requests yet.</p>
          <p className="text-xs text-text-muted mt-1">
            Actions that need admin approval will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {myRequests.map((request, index) => {
            const status = request.status as ApprovalStatus;
            const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="p-5 bg-bg-surface border border-border-soft rounded-2xl"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-bold text-text-main">{request.label}</p>
                    <p className="text-xs text-text-muted font-mono mt-0.5">{request.action}</p>
                  </div>

                  <span
                    className={cn(
                      'text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1',
                      config.classes
                    )}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                      {config.icon}
                    </span>
                    {config.label}
                  </span>
                </div>

                <div className="mt-3 p-3 bg-bg-muted rounded-xl text-xs text-text-muted space-y-1">
                  {Object.entries(tryParsePayload(request.payload))
                    .filter(([key]) => key !== 'requestedBy')
                    .map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <span className="capitalize font-semibold text-text-sub w-20 shrink-0">
                          {key}:
                        </span>
                        <span className="text-text-muted">{String(value)}</span>
                      </div>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-soft">
                  <span className="text-[10px] text-text-muted">
                    Submitted {timeAgo(request.createdAt)}
                  </span>
                  {request.resolvedAt && (
                    <span className="text-[10px] text-text-muted">
                      Resolved {timeAgo(request.resolvedAt)}
                    </span>
                  )}
                </div>

                {request.reviewNote && (
                  <div className="mt-3 p-3 rounded-xl bg-primary/5 border border-primary/10 text-xs">
                    <span className="font-bold text-primary">Admin note: </span>
                    <span className="text-text-sub">{request.reviewNote}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}