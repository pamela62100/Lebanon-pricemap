import { cn } from '@/lib/utils';
import type { PriceStatus } from '@/types';

interface StatusBadgeProps {
  status: PriceStatus | string;
  className?: string;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  verified:  { bg: 'bg-green-100', text: 'text-green-700', label: 'Verified' },
  pending:   { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
  flagged:   { bg: 'bg-red-100', text: 'text-red-700', label: 'Flagged' },
  active:    { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
  warned:    { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Warned' },
  suspended: { bg: 'bg-red-100', text: 'text-red-700', label: 'Suspended' },
  banned:    { bg: 'bg-red-100', text: 'text-red-700', label: 'Banned' },
  open:      { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Open' },
  reviewed:  { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Reviewed' },
  resolved:  { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 border text-[9px] font-black uppercase tracking-widest rounded shadow-sm',
        config.bg,
        config.text,
        className
      )}
    >
      {config.label}
    </span>
  );
}