import { cn } from '@/lib/utils';

interface TrustBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TrustBadge({ score, size = 'sm', className }: TrustBadgeProps) {
  if (size === 'sm') {
    return (
      <span className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold',
        'bg-primary-soft text-primary',
        className
      )}>
        {score} ★
      </span>
    );
  }

  if (size === 'md') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="text-sm font-semibold text-text-sub">Trust Score</span>
        <span className="text-sm font-bold text-primary">{score}/100</span>
      </div>
    );
  }

  // lg: animated arc
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r="40" fill="none" stroke="var(--bg-muted)" strokeWidth="6" />
        <circle
          cx="48" cy="48" r="40" fill="none"
          stroke="var(--primary)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 48 48)"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-text-main">{score}</span>
        <span className="text-xs text-text-muted">Trust</span>
      </div>
    </div>
  );
}
