import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pricesApi } from '@/api/prices.api';

interface TickerItem {
  message: string;
}

async function fetchBroadcasts(): Promise<TickerItem[]> {
  try {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5223/api';
    const res = await fetch(`${base}/broadcasts`);
    const json = await res.json();
    const data = json?.data;
    if (Array.isArray(data) && data.length > 0) {
      return data.map((b: any) => ({ message: b.message }));
    }
  } catch { /* ignore */ }
  return [];
}

export function GlobalEssentialsTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    fetchBroadcasts().then(broadcasts => {
      if (broadcasts.length > 0) {
        setItems(broadcasts);
        return;
      }
      // Fall back to live price data if no broadcasts are active
      pricesApi.search({ verifiedOnly: true }).then((res) => {
        const data = (res as any).data?.data ?? (res as any).data;
        const entries = Array.isArray(data) ? data.slice(0, 10) : [];
        const messages: TickerItem[] = entries.map((e: any) => ({
          message: `${e.product?.name ?? 'Product'} at ${e.store?.name ?? 'Store'} — LBP ${(e.priceLbp ?? 0).toLocaleString()}`,
        }));
        if (messages.length > 0) setItems(messages);
      }).catch(() => {});
    });
  }, []);

  if (items.length === 0) return null;

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
          {items.concat(items).map((item, index) => (
            <div key={index} className="flex items-center gap-3 sm:gap-4">
              <span className="text-border-primary text-[10px]">•</span>
              <span className="text-[10px] sm:text-[11px] text-text-sub tracking-[0.08em] uppercase">
                {item.message}
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
