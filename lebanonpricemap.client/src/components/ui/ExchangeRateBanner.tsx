import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';
import { timeAgo } from '@/lib/utils';

export function ExchangeRateBanner() {
  const { rateLbpPerUsd, lastUpdated, source, isLoading, fetchRate } =
    useExchangeRateStore();

  useEffect(() => { fetchRate(); }, []);

  const isRecent =
    new Date().getTime() - new Date(lastUpdated).getTime() < 10 * 60 * 1000;

  return (
    <div
      style={{ background: 'var(--primary)' }}
      className="w-full h-8 flex items-center justify-center gap-3 z-50 flex-shrink-0"
    >
      <motion.span
        className="text-white text-[11px] font-bold tracking-wide"
        animate={isRecent ? { opacity: [1, 0.5, 1] } : {}}
        transition={{ repeat: 2, duration: 0.5 }}
      >
        {isLoading
          ? '💵 Refreshing...'
          : `💵 1 USD = ${rateLbpPerUsd.toLocaleString()} LBP`}
      </motion.span>
      <span className="text-white/50 text-[10px] hidden sm:inline">
        · {timeAgo(lastUpdated)} · {source}
      </span>
      <button
        onClick={fetchRate}
        disabled={isLoading}
        className="text-white/60 hover:text-white transition-colors"
        title="Refresh rate"
      >
        <span
          className={`material-symbols-outlined ${isLoading ? 'animate-spin' : ''}`}
          style={{ fontSize: '13px' }}
        >
          refresh
        </span>
      </button>
    </div>
  );
}
