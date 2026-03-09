import { useState, useMemo } from 'react';
import { NotificationCard } from '@/components/cards/NotificationCard';
import { getEnrichedNotifications } from '@/api/mockData';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Notification as NotifType } from '@/types';

export function NotificationsPage() {
  const allNotifications = useMemo(() => getEnrichedNotifications(), []);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());

  const markAllRead = () => setReadIds(new Set(allNotifications.map((n: any) => Number(n.id))));
  const markAsRead = (id: any) => {
    setReadIds(prev => {
      const newSet = new Set(prev);
      newSet.add(Number(id));
      return newSet;
    });
  };

  const notificationsWithReadStatus = useMemo(() => {
    return allNotifications.map((n: any) => ({
      ...n,
      isRead: readIds.has(Number(n.id)),
    }));
  }, [allNotifications, readIds]);

  const unreadCount = notificationsWithReadStatus.filter(n => !n.isRead).length;

  return (
    <div className="animate-page max-w-4xl mx-auto px-5 py-12 md:py-20 flex flex-col gap-12">

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-border-soft">
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">Signal_Inbox</p>
          <h1 className="text-5xl font-bold text-text-main tracking-tighter leading-none">
            Inbox Intelligence. {unreadCount > 0 && <span className="text-primary font-data ml-2">({unreadCount})</span>}
          </h1>
          <p className="text-sm font-medium text-text-muted mt-4 opacity-60">Critical updates from your price network and verified nodes.</p>
        </div>
        <button
          onClick={markAllRead}
          className="h-12 px-6 rounded-2xl bg-bg-muted font-bold text-[10px] text-text-muted uppercase tracking-widest hover:bg-text-main hover:text-white transition-all flex items-center gap-2 shrink-0 group"
        >
          <span className="material-symbols-outlined text-lg group-hover:animate-pulse">done_all</span>
          Mark all as read
        </button>
      </header>

      <div className="flex flex-col gap-3">
        {notificationsWithReadStatus.map((notification: NotifType) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onClick={() => markAsRead(notification.id)}
          />
        ))}
        {allNotifications.length === 0 && (
          <EmptyState 
            icon="notifications_off" 
            title="Inbox Zero" 
            subtitle="Your communication node is currently silent. No active signals detected."
          />
        )}
      </div>
    </div>
  );
}
