import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { PriceEntry } from '@/types';
import { timeAgo } from '@/lib/utils';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';

interface PriceResultCardProps {
  entry: PriceEntry;
  index: number;
}

const PriceResultCardBase = ({ entry, index }: PriceResultCardProps) => {
  const navigate = useNavigate();
  const { rateLbpPerUsd } = useExchangeRateStore();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  const usdPrice = (entry.priceLbp / rateLbpPerUsd).toFixed(2);
  const isFeatured = index === 0;

  const handleAddToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    addItem(entry.productId);
    addToast(`${entry.product?.name ?? 'Item'} added to cart`);
  };

  const storeInitials =
    entry.store?.name
      ?.split(' ')
      .map((name: string) => name[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'SN';

  if (isFeatured) {
    return (
      <div
        className="rounded-[32px] bg-[linear-gradient(135deg,#17181f_0%,#101116_100%)] p-6 sm:p-8 cursor-pointer group relative overflow-hidden border border-white/5 shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
        onClick={() => navigate(`/app/price/${entry.id}`)}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-br from-primary/10 to-transparent" />

        <div className="relative z-10 flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-white/55 mb-3">
              Best price in {entry.product?.category?.toLowerCase() || 'this category'}
            </p>
            <h3 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">
              {entry.store?.name}
            </h3>
            <p className="text-sm text-white/60">{entry.store?.district}</p>
          </div>

          {entry.source === 'official' ? (
            <div className="px-4 py-2 rounded-full bg-white/10 border border-white/10 flex items-center gap-2 shrink-0">
              <span className="material-symbols-outlined text-white text-sm">verified</span>
              <span className="text-xs font-semibold text-white">Verified source</span>
            </div>
          ) : null}
        </div>

        <div className="relative z-10">
          <div className="flex items-end gap-3 flex-wrap">
            <span className="font-data text-5xl sm:text-7xl text-white font-bold tracking-tight leading-none">
              {entry.priceLbp.toLocaleString()}
            </span>
            <span className="text-xl sm:text-2xl font-semibold text-white/55 mb-1">LBP</span>
          </div>
          <p className="text-lg text-white/45 mt-3">About ${usdPrice}</p>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4 mt-10 pt-6 border-t border-white/10">
          <p className="text-sm text-white/45">Updated {timeAgo(entry.createdAt)}</p>

          <button
            className="w-14 h-14 rounded-full bg-white text-text-main flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
            onClick={handleAddToCart}
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">add_shopping_cart</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white border border-border-soft rounded-[28px] p-5 sm:p-6 cursor-pointer group hover:border-text-main/10 hover:shadow-sm transition-all duration-200"
      onClick={() => navigate(`/app/price/${entry.id}`)}
    >
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-bg-muted flex items-center justify-center text-sm font-bold text-text-muted shrink-0">
            {storeInitials}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-lg font-semibold text-text-main truncate">{entry.store?.name}</p>
              {entry.source === 'official' ? (
                <span className="material-symbols-outlined text-text-muted text-base">verified</span>
              ) : null}
            </div>

            <p className="text-sm text-text-muted mt-1">
              {entry.store?.district} • {timeAgo(entry.createdAt)}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="flex items-end gap-2 justify-end flex-wrap">
            <span className="font-data text-2xl sm:text-3xl text-text-main font-bold tracking-tight">
              {entry.priceLbp.toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-text-muted mb-1">LBP</span>
          </div>
          <p className="text-sm text-text-muted mt-1">About ${usdPrice}</p>
        </div>
      </div>
    </div>
  );
};

export const PriceResultCard = React.memo(PriceResultCardBase);