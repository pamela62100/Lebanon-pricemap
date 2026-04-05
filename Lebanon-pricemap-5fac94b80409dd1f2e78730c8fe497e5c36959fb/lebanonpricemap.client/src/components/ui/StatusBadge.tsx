import { cn } from '@/lib/utils';

const CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  verified:  { bg: 'bg-green-100', text: 'text-green-700', label: 'Verified' },
  pending:   { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
  flagged:   { bg: 'bg-red-100',   text: 'text-red-600',   label: 'Flagged' },
  active:    { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
  warned:    { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Warned' },
  suspended: { bg: 'bg-red-100',   text: 'text-red-600',   label: 'Suspended' },
  banned:    { bg: 'bg-red-100',   text: 'text-red-600',   label: 'Banned' },
  open:      { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Open' },
  reviewed:  { bg: 'bg-blue-100',  text: 'text-blue-700',  label: 'Reviewed' },
  resolved:  { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved' },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const c = CONFIG[status] ?? CONFIG.pending;
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
      'text-[11px] font-semibold',
      c.bg, c.text, className
    )}>
      {c.label}
    </span>
  );
}