import { motion } from 'framer-motion';
import { getGlobalAlerts } from '@/api/mockData';

export function GlobalEssentialsTicker() {
  const alerts = getGlobalAlerts();

  if (alerts.length === 0) return null;

  return (
    <div className="w-full bg-bg-surface border-b border-border-primary overflow-hidden h-8 sm:h-9 flex items-center relative z-40 shadow-sm">
      <div className="hidden sm:flex items-center gap-2 px-4 border-r border-border-primary whitespace-nowrap bg-bg-surface z-10 h-full shrink-0">
        <span className="material-symbols-outlined text-primary text-[13px]">history_edu</span>
        <span className="text-[10px] font-semibold text-text-main tracking-[0.16em] uppercase">
          Market updates
        </span>
      </div>

      <div className="flex-1 relative overflow-hidden h-full flex items-center">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-12 sm:gap-16 whitespace-nowrap absolute left-0"
        >
          {alerts.concat(alerts).map((alert, index) => (
            <div key={index} className="flex items-center gap-3 sm:gap-4">
              <span className="text-border-primary text-[10px]">•</span>
              <span className="text-[10px] sm:text-[11px] text-text-sub tracking-[0.08em] uppercase">
                {alert.message}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="px-3 sm:px-4 flex items-center gap-2 border-l border-border-primary bg-bg-surface z-10 h-full shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[9px] sm:text-[10px] text-text-muted uppercase tracking-[0.16em] font-semibold">
          Live
        </span>
      </div>
    </div>
  );
}