import { useEffect } from 'react';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';
import { timeAgo } from '@/lib/utils';

export function ExchangeRateBanner() {
  const { rateLbpPerUsd, lastUpdated, isLoading, fetchRate } = useExchangeRateStore();

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  return (
    <div className="w-full bg-bg-muted border-b border-border-soft min-h-[36px] flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-5 text-center">
      <span className="text-[11px] sm:text-xs font-medium text-text-muted">1 USD</span>

      <span className="w-1 h-1 rounded-full bg-border-primary shrink-0" />

      <span className="text-[11px] sm:text-xs font-bold text-text-main font-data">
        {isLoading ? 'Loading...' : `${rateLbpPerUsd.toLocaleString()} LBP`}
      </span>

      <span className="text-[10px] sm:text-xs text-text-muted hidden sm:inline">
        Updated {timeAgo(lastUpdated)}
      </span>

      <button
        onClick={fetchRate}
        disabled={isLoading}
        className="text-text-muted hover:text-text-main transition-colors ml-1 disabled:opacity-50"
        type="button"
        aria-label="Refresh exchange rate"
      >
        <span
          className={`material-symbols-outlined text-[14px] ${isLoading ? 'animate-spin' : ''}`}
        >
          refresh
        </span>
      </button>
    </div>
  );
}