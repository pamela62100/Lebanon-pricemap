import { AnimatePresence, motion } from 'framer-motion';
import { useOfflineStore } from '@/store/useOfflineStore';
import { timeAgo } from '@/lib/utils';

export function OfflineBanner() {
  const { isOnline, lastSyncAt } = useOfflineStore();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 32, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="w-full flex items-center justify-center gap-2 overflow-hidden flex-shrink-0"
          style={{ background: '#92400e' }}
        >
          <span
            className="material-symbols-outlined text-yellow-300"
            style={{ fontSize: '14px' }}
          >
            wifi_off
          </span>
          <span className="text-yellow-200 text-[11px] font-semibold">
            Offline
            {lastSyncAt
              ? ` — cached prices from ${timeAgo(lastSyncAt)}`
              : ' — no cached data'}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
