import { cn } from '@/lib/utils';
import type { PriceStatus } from '@/types';

interface StatusBadgeProps {
  status: PriceStatus | string;
  className?: string;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  verified:  { bg: 'bg-[var(--status-verified-bg)]',  text: 'text-[var(--status-verified-text)]',  label: 'Verified' },
  pending:   { bg: 'bg-[var(--status-pending-bg)]',   text: 'text-[var(--status-pending-text)]',   label: 'Pending' },
  flagged:   { bg: 'bg-[var(--status-flagged-bg)]',   text: 'text-[var(--status-flagged-text)]',   label: 'Flagged' },
  active:    { bg: 'bg-[var(--status-verified-bg)]',  text: 'text-[var(--status-verified-text)]',  label: 'Active' },
  warned:    { bg: 'bg-[var(--status-pending-bg)]',   text: 'text-[var(--status-pending-text)]',   label: 'Warned' },
  suspended: { bg: 'bg-[var(--status-flagged-bg)]',   text: 'text-[var(--status-flagged-text)]',   label: 'Suspended' },
  banned:    { bg: 'bg-[var(--status-flagged-bg)]',   text: 'text-[var(--status-flagged-text)]',   label: 'Banned' },
  open:      { bg: 'bg-[var(--status-pending-bg)]',   text: 'text-[var(--status-pending-text)]',   label: 'Open' },
  reviewed:  { bg: 'bg-[var(--status-info-bg)]',      text: 'text-[var(--status-info-text)]',      label: 'Reviewed' },
  resolved:  { bg: 'bg-[var(--status-verified-bg)]',  text: 'text-[var(--status-verified-text)]',  label: 'Resolved' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 border text-[9px] font-black uppercase tracking-[0.1em] shadow-[1px_1px_0px_rgba(0,0,0,0.1)]',
      config.bg, config.text, 'border-current/20', className
    )}>
      {config.label}
    </span>
  );
}
