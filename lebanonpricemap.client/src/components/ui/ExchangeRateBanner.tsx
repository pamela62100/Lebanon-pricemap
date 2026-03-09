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
    <div className="w-full bg-bg-muted border-b border-border-soft h-8 flex items-center justify-center gap-3 px-5">
      <span className="text-[11px] font-semibold text-text-muted">
        1 USD
      </span>
      <span className="w-1 h-1 rounded-full bg-border-primary" />
      <span className="text-[11px] font-bold text-text-main font-data">
        {isLoading ? '--- LBP' : `${rateLbpPerUsd.toLocaleString()} LBP`}
      </span>
      <span className="text-[10px] text-text-muted hidden sm:inline">
        · {timeAgo(lastUpdated)}
      </span>
      <button 
        onClick={fetchRate} 
        disabled={isLoading}
        className="text-text-muted hover:text-text-main transition-colors ml-1"
      >
        <span className={`material-symbols-outlined ${isLoading ? 'animate-spin' : ''}`} style={{ fontSize: '12px' }}>
          refresh
        </span>
      </button>
    </div>
  );
}
