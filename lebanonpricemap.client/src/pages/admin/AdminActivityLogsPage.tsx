import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getEnrichedAuditLogs } from '@/api/mockData';
import { timeAgo, cn } from '@/lib/utils';

const actionColors: Record<string, string> = {
  approved: 'border-l-[var(--status-verified-text)]',
  rejected: 'border-l-[var(--status-flagged-text)]',
  warned:   'border-l-[var(--status-pending-text)]',
  banned:   'border-l-[var(--status-flagged-text)]',
  edited:   'border-l-[var(--accent-blue)]',
  merged:   'border-l-[var(--status-info-text)]',
};

const actionIcons: Record<string, string> = {
  approved: 'check_circle',
  rejected: 'cancel',
  warned:   'warning',
  banned:   'block',
  edited:   'edit',
  merged:   'merge',
};

export function AdminActivityLogsPage() {
  const logs = useMemo(() => getEnrichedAuditLogs(), []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      <h1 className="text-2xl font-bold text-text-main mb-2">Activity Logs</h1>
      <p className="text-sm text-text-muted mb-8">Audit trail of all admin actions</p>

      <div className="relative pl-8">
        {/* Timeline line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border-soft" />

        {/* Timeline items */}
        <div className="flex flex-col gap-4">
          {logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'relative bg-bg-surface border border-border-soft rounded-xl p-5 border-l-4',
                actionColors[log.action] || 'border-l-border-soft'
              )}
            >
              {/* Timeline dot */}
              <div className="absolute -left-[25px] top-5 w-4 h-4 rounded-full bg-bg-surface border-2 border-border-soft flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-muted flex items-center justify-center">
                    <span className="material-symbols-outlined text-text-sub" style={{ fontSize: '18px' }}>
                      {actionIcons[log.action] || 'info'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-main capitalize">{log.action}</p>
                    <p className="text-xs text-text-muted">by {log.performer?.name || 'System'}</p>
                  </div>
                </div>
                <span className="text-xs text-text-muted font-medium">{timeAgo(log.createdAt)}</span>
              </div>

              {log.note && (
                <p className="text-sm text-text-sub mt-3 pl-11">{log.note}</p>
              )}

              {/* Target info */}
              <div className="flex gap-2 mt-3 pl-11">
                {log.targetUserId && (
                  <span className="text-xs px-2 py-1 rounded-full bg-bg-muted text-text-muted">
                    User: {log.targetUserId}
                  </span>
                )}
                {log.targetPriceEntryId && (
                  <span className="text-xs px-2 py-1 rounded-full bg-bg-muted text-text-muted">
                    Price: {log.targetPriceEntryId}
                  </span>
                )}
                {log.targetProductId && (
                  <span className="text-xs px-2 py-1 rounded-full bg-bg-muted text-text-muted">
                    Product: {log.targetProductId}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
