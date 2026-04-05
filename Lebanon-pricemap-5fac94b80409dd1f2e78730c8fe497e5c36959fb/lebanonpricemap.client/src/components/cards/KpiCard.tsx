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
    <div className={cn('bg-white border border-border-soft rounded-[24px] p-5 sm:p-6 shadow-sm', className)}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="w-11 h-11 rounded-2xl bg-bg-muted flex items-center justify-center">
          <span className="material-symbols-outlined text-text-sub text-[20px]">{icon}</span>
        </div>

        {trend !== undefined ? (
          <span
            className={cn(
              'text-xs font-semibold px-2.5 py-1 rounded-full',
              trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            )}
          >
            {trend >= 0 ? '+' : ''}
            {trend}%
          </span>
        ) : null}
      </div>

      <p className="font-data text-3xl sm:text-4xl font-bold text-text-main leading-none mb-2">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>

      <p className="text-sm font-medium text-text-muted">{label}</p>
    </div>
  );
}