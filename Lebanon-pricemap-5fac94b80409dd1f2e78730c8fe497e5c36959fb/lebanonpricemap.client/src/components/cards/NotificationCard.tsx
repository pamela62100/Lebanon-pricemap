import type { Notification as NotifType } from '@/types';
import { cn, timeAgo } from '@/lib/utils';

interface NotificationCardProps {
  notification: NotifType;
  onClick?: () => void;
}

const iconConfig: Record<string, { color: string; icon: string; label: string }> = {
  price_verified: { color: 'text-green-500', icon: 'verified', label: 'Verified price' },
  price_flagged: { color: 'text-red-500', icon: 'warning', label: 'Flagged price' },
  price_alert: { color: 'text-amber-500', icon: 'notifications_active', label: 'Price alert' },
  trust_earned: { color: 'text-primary', icon: 'workspace_premium', label: 'Trust earned' },
  feedback_received: { color: 'text-text-muted', icon: 'chat', label: 'Feedback' },
};

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const config = iconConfig[notification.type] || iconConfig.feedback_received;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex gap-4 sm:gap-5 p-5 sm:p-6 rounded-[28px] border text-left relative overflow-hidden transition-all duration-200',
        notification.isRead
          ? 'bg-white border-border-soft hover:border-text-main/10 hover:shadow-sm'
          : 'bg-bg-muted/40 border-text-main/10 shadow-sm'
      )}
      type="button"
    >
      {!notification.isRead ? (
        <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-text-main" />
      ) : null}

      <div
        className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform',
          notification.isRead ? 'bg-bg-muted' : 'bg-white shadow-sm'
        )}
      >
        <span className={cn('material-symbols-outlined text-2xl', config.color)}>{config.icon}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
          <p className="text-xs font-semibold text-text-muted">{config.label}</p>
          <span className="text-xs text-text-muted">{timeAgo(notification.createdAt)}</span>
        </div>

        <p className="text-lg font-semibold text-text-main leading-snug">{notification.title}</p>
        <p className="text-sm text-text-muted mt-1 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
      </div>
    </button>
  );
}