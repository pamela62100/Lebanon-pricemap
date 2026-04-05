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
      <div className="animate-page px-6 lg:px-8 py-8 flex flex-col gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-5 h-20 animate-pulse bg-bg-muted/40" />
        ))}
      </div>
    );
  }

  return (
    <div className="animate-page px-6 lg:px-8 py-8 flex flex-col gap-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-soft">
        <div>
          <h1 className="text-2xl font-bold text-text-main">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-sm bg-primary text-white rounded-full">{unreadCount}</span>
            )}
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            Price alerts and updates from your network
          </p>
        </div>

        <button
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="h-9 px-4 rounded-lg bg-bg-muted text-sm font-medium text-text-muted hover:bg-primary hover:text-white transition-all flex items-center gap-2 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-base">done_all</span>
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
