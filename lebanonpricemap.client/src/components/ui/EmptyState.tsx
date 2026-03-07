import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, subtitle, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-16 px-8 text-center gap-4',
      className
    )}>
      <span className="text-5xl opacity-30">{icon}</span>
      <h3 className="text-lg font-semibold text-text-main">{title}</h3>
      {subtitle && (
        <p className="text-sm text-text-muted max-w-[240px] leading-relaxed">{subtitle}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
