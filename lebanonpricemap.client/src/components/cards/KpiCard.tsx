
import { cn } from '@/lib/utils';
import { Card } from './Card';

interface KpiCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: number;
  className?: string;
}

export function KpiCard({ icon, label, value, trend, className }: KpiCardProps) {
  return (
    <Card className={cn('flex flex-col justify-between group', className)} padding="p-8">
      <div className="flex items-start justify-between mb-8">
        <div className="w-12 h-12 bg-text-main text-bg-base flex items-center justify-center shadow-[4px_4px_0px_#0066FF] transition-transform group-hover:scale-110 rounded-md">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{icon}</span>
        </div>
        {trend !== undefined && (
          <div className={cn(
            'px-2 py-1 border text-[9px] font-black flex items-center gap-1 uppercase tracking-widest rounded-md',
            trend >= 0 ? 'bg-green-600/5 text-green-700 border-green-600/20' : 'bg-red-600/5 text-red-700 border-red-600/20'
          )}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              {trend >= 0 ? 'trending_up' : 'trending_down'}
            </span>
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>

      <div>
        <p className="text-4xl font-serif font-black text-text-main leading-tight mb-2">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] font-sans">{label}</p>
      </div>
    </Card>
  );
}