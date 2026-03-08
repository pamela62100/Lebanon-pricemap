import { motion } from 'framer-motion';
import { getGlobalAlerts } from '@/api/mockData';
import { cn } from '@/lib/utils';

export function GlobalEssentialsTicker() {
  const alerts = getGlobalAlerts();
  
  if (alerts.length === 0) return null;

  return (
    <div className="w-full bg-bg-base border-y border-border-primary/40 overflow-hidden py-2 flex items-center relative z-40">
      <div className="flex items-center gap-4 px-6 border-r border-border-primary/20 whitespace-nowrap z-10 bg-bg-base">
         <span className="material-symbols-outlined text-primary text-[14px]">history_edu</span>
         <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Market Pulse</span>
      </div>
      
      <div className="flex-1 relative overflow-hidden h-5 flex items-center">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-16 whitespace-nowrap absolute left-0"
        >
          {alerts.concat(alerts).map((alert, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-border-primary/40 text-[10px] font-serif">|</span>
              <span className="text-[10px] font-bold text-text-main/80 tracking-wide uppercase tabular-nums">
                {alert.message}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
      
      <div className="px-6 flex items-center gap-3 border-l border-border-primary/20 bg-bg-base z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        <span className="text-[9px] font-black text-text-muted hover:text-primary transition-colors cursor-default uppercase tracking-widest">Captured_Live</span>
      </div>
    </div>
  );
}
