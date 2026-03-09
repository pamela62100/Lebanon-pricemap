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
    <div className={cn('card p-5', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-2xl bg-bg-muted flex items-center justify-center">
          <span className="material-symbols-outlined text-text-sub" style={{ fontSize: '20px' }}>
            {icon}
          </span>
        </div>
        {trend !== undefined && (
          <span className={cn(
            'text-[11px] font-semibold px-2 py-0.5 rounded-full',
            trend >= 0
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'
          )}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="font-data text-3xl font-bold text-text-main leading-none mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">{label}</p>
    </div>
  );
}