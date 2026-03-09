import type { Notification as NotifType } from '@/types';
import { cn, timeAgo } from '@/lib/utils';

interface NotificationCardProps {
  notification: NotifType;
  onClick?: () => void;
}

const iconConfig: Record<string, { color: string; icon: string }> = {
  price_verified:    { color: 'text-green-500',   icon: 'verified' },
  price_flagged:     { color: 'text-red-500',     icon: 'warning' },
  price_alert:       { color: 'text-amber-500',   icon: 'notifications_active' },
  trust_earned:      { color: 'text-primary',     icon: 'workspace_premium' },
  feedback_received: { color: 'text-text-muted',  icon: 'chat' },
};

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const config = iconConfig[notification.type] || iconConfig.feedback_received;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex gap-6 p-6 rounded-[2rem] border transition-all duration-300 text-left relative overflow-hidden group',
        notification.isRead
          ? 'bg-white border-border-soft hover:border-text-main/10'
          : 'bg-bg-muted border-text-main/10 shadow-lg shadow-text-main/5'
      )}
    >
      {!notification.isRead && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-text-main rounded-r-full" />
      )}
      
      <div className={cn(
        'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110',
        notification.isRead ? 'bg-bg-muted' : 'bg-white shadow-sm'
      )}>
        <span className={cn("material-symbols-outlined text-2xl", config.color)}>
          {config.icon}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4 mb-2">
           <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
             {notification.type.replace('_', ' ')}
           </p>
           <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-40">
             {timeAgo(notification.createdAt)}
           </span>
        </div>
        <p className="text-lg font-bold text-text-main tracking-tight group-hover:text-primary transition-colors">{notification.title}</p>
        <p className="text-sm font-medium text-text-muted mt-1 line-clamp-2 opacity-60 leading-relaxed">{notification.message}</p>
      </div>
    </button>
  );
}
