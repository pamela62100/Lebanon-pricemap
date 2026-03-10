import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-14 sm:py-16 px-6 sm:px-8 text-center gap-3',
        className
      )}
    >
      <div className="w-16 h-16 rounded-3xl bg-bg-muted flex items-center justify-center mb-1">
        <span className="material-symbols-outlined text-text-muted text-[28px]">
          {icon}
        </span>
      </div>

      <p className="text-base sm:text-lg font-semibold text-text-main">{title}</p>

      {subtitle ? (
        <p className="text-sm text-text-muted max-w-[280px] leading-relaxed">
          {subtitle}
        </p>
      ) : null}

      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}