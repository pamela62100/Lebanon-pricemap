import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { NotificationCard } from '@/components/cards/NotificationCard';
import { getEnrichedNotifications } from '@/api/mockData';

export function NotificationsPage() {
  const notifications = useMemo(() => getEnrichedNotifications(), []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto flex flex-col gap-6">
      
      <div className="flex items-center justify-between bg-bg-surface border border-border-soft p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Your Alerts</h1>
          <p className="text-sm text-text-muted mt-1">Stay updated on your tracked items and trust score</p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-bg-muted font-semibold text-text-sub hover:bg-border-soft transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>done_all</span>
          Mark all as read
        </button>
      </div>

      <div className="bg-bg-surface border border-border-soft rounded-3xl p-2 shadow-sm">
        <div className="flex flex-col gap-2">
          {notifications.map((notification: any) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
          {notifications.length === 0 && (
            <div className="py-16 text-center text-text-muted">You have no new alerts.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
