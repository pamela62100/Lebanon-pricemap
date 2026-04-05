import { cn } from '@/lib/utils';

interface TrustBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TrustBadge({ score, size = 'sm', className }: TrustBadgeProps) {
  if (size === 'sm') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 border text-[9px] font-black uppercase tracking-widest',
          'bg-blue-50 border-blue-200 text-blue-700 shadow-card',
          className
        )}
      >
        {score} ★
      </span>
    );
  }

  if (size === 'md') {
    return (
      <div className={cn('flex items-center gap-3 border border-border-soft px-4 py-2 rounded-xl bg-bg-muted', className)}>
        <span className="text-xs text-text-muted">Trust score</span>
        <span className="text-sm font-bold text-primary border-l border-border-soft pl-3">{score}/100</span>
      </div>
    );
  }

  // lg circular
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className={cn('relative inline-flex items-center justify-center p-2 border border-border-soft rounded-2xl bg-bg-base shadow-sm', className)}>
      <svg width="96" height="96" viewBox="0 0 96 96" className="rotate-[-90deg]">
        <circle cx="48" cy="48" r="40" fill="none" stroke="var(--bg-muted)" strokeWidth="4" />
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-text-main">{score}</span>
        <span className="text-xs text-text-muted mt-1">Trust</span>
      </div>
    </div>
  );
}