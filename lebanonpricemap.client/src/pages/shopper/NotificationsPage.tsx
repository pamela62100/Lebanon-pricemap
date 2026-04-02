import { useState, useEffect } from 'react';
import { NotificationCard } from '@/components/cards/NotificationCard';
import { usersApi } from '@/api/users.api';
import { useAuthStore } from '@/store/useAuthStore';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Notification as NotifType } from '@/types';

export function NotificationsPage() {
  const user = useAuthStore((s) => s.user);
  const [notifications, setNotifications] = useState<NotifType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await usersApi.getNotifications(user.id);
        const data = res.data?.data ?? res.data;
        setNotifications(Array.isArray(data) ? data : []);
      } catch {
        // errors handled by axios interceptor
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

  const markAsRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="animate-page max-w-4xl mx-auto px-5 py-12 md:py-20 flex flex-col gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-5 h-20 animate-pulse bg-bg-muted/40" />
        ))}
      </div>
    );
  }

  return (
    <div className="animate-page max-w-4xl mx-auto px-5 py-12 md:py-20 flex flex-col gap-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-border-soft">
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">
            Notifications
          </p>
          <h1 className="text-5xl font-bold text-text-main tracking-tighter leading-none">
            Updates
            {unreadCount > 0 && (
              <span className="text-primary font-data ml-2">({unreadCount})</span>
            )}
          </h1>
          <p className="text-sm font-medium text-text-muted mt-4 opacity-60">
            Important alerts from your price network and trusted updates.
          </p>
        </div>

        <button
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="h-12 px-6 rounded-2xl bg-bg-muted font-bold text-[10px] text-text-muted uppercase tracking-widest hover:bg-text-main hover:text-white transition-all flex items-center gap-2 shrink-0 group disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-lg group-hover:animate-pulse">done_all</span>
          Mark all as read
        </button>
      </header>

      <div className="flex flex-col gap-3">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onClick={() => markAsRead(notification.id)}
          />
        ))}

        {notifications.length === 0 && (
          <EmptyState
            icon="notifications_off"
            title="No notifications yet"
            subtitle="You're all caught up."
          />
        )}
      </div>
    </div>
  );
}
