import { cn } from '@/lib/utils';

interface KpiCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: number;
  className?: string;
}

export function KpiCard({ icon, label, value, trend, className }: KpiCardProps) {
  return (
    <div className={cn(
      'bg-bg-surface border border-border-soft rounded-xl p-6 shadow-sm',
      className
    )}>
      <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center mb-4">
        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{icon}</span>
      </div>
      <p className="text-3xl font-bold text-text-main">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      <p className="text-sm text-text-muted mt-1">{label}</p>
      {trend !== undefined && (
        <p className={cn(
          'text-xs font-semibold flex items-center gap-0.5 mt-2',
          trend >= 0 ? 'text-[var(--status-verified-text)]' : 'text-[var(--status-flagged-text)]'
        )}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            {trend >= 0 ? 'trending_up' : 'trending_down'}
          </span>
          {trend >= 0 ? '+' : ''}{trend}%
        </p>
      )}
    </div>
  );
}
