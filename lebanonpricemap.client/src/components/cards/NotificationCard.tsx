import type { Notification as NotifType } from '@/types';
import { cn, timeAgo } from '@/lib/utils';

interface NotificationCardProps {
  notification: NotifType;
  onClick?: () => void;
}

const iconConfig: Record<string, { bg: string; icon: string }> = {
  price_verified:    { bg: 'bg-[var(--status-verified-bg)] text-[var(--status-verified-text)]', icon: '✓' },
  price_flagged:     { bg: 'bg-[var(--status-flagged-bg)] text-[var(--status-flagged-text)]',   icon: '⚠' },
  price_alert:       { bg: 'bg-[var(--status-pending-bg)] text-[var(--status-pending-text)]',   icon: '📉' },
  trust_earned:      { bg: 'bg-primary-soft text-primary',                                       icon: '🌟' },
  feedback_received: { bg: 'bg-[var(--status-info-bg)] text-[var(--status-info-text)]',          icon: '💬' },
};

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const config = iconConfig[notification.type] || iconConfig.feedback_received;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex gap-4 p-4 rounded-xl border text-left transition-colors',
        notification.isRead
          ? 'bg-bg-surface border-border-soft'
          : 'bg-primary-soft/60 border-border-primary'
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-base',
        config.bg
      )}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-main">{notification.title}</p>
        <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{notification.message}</p>
      </div>
      <span className="text-xs text-text-muted flex-shrink-0 font-semibold uppercase">
        {timeAgo(notification.createdAt)}
      </span>
    </button>
  );
}
