import { motion } from 'framer-motion';
import { getGlobalAlerts } from '@/api/mockData';
import { cn } from '@/lib/utils';

export function GlobalEssentialsTicker() {
  const alerts = getGlobalAlerts();
  
  if (alerts.length === 0) return null;

  return (
    <div className="w-full bg-bg-surface border-b border-border-primary overflow-hidden h-7 flex items-center relative z-40 shadow-sm">
      <div className="flex items-center gap-2 px-4 border-r border-border-primary whitespace-nowrap bg-bg-surface z-10 h-full">
         <span className="material-symbols-outlined text-primary" style={{ fontSize: '12px' }}>history_edu</span>
         <span className="font-data text-[9px] text-text-main tracking-[0.2em] font-bold uppercase">MARKET_PULSE</span>
      </div>
      
      <div className="flex-1 relative overflow-hidden h-5 flex items-center">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-16 whitespace-nowrap absolute left-0"
        >
          {alerts.concat(alerts).map((alert, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-border-primary text-[9px] font-data">•</span>
              <span className="font-data text-[9px] text-text-sub tracking-widest uppercase">
                {alert.message}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
      
      <div className="px-4 flex items-center gap-2 border-l border-border-primary bg-bg-surface z-10 h-full">
        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
        <span className="font-data text-[8px] text-text-muted uppercase tracking-[0.2em] font-bold">LIVE_DATA</span>
      </div>
    </div>
  );
}
