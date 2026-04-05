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

const CATEGORY_ICONS: Record<string, string> = {
  Dairy: 'water_drop',
  Bakery: 'bakery_dining',
  Meat: 'kebab_dining',
  Grains: 'grain',
  Produce: 'eco',
  Fuel: 'local_gas_station',
  Beverages: 'local_drink',
};

const PriceResultCardBase = ({ entry, index }: PriceResultCardProps) => {
  const navigate = useNavigate();
  const { rateLbpPerUsd } = useExchangeRateStore();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  const usdPrice = (entry.priceLbp / rateLbpPerUsd).toFixed(2);
  const isBest = index === 0;
  const icon = CATEGORY_ICONS[entry.product?.category ?? ''] ?? 'inventory_2';

  const handleAddToList = (event: React.MouseEvent) => {
    event.stopPropagation();
    addItem(entry.productId);
    addToast(`${entry.product?.name ?? 'Item'} added to list`);
  };

<<<<<<< HEAD
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

          <div className="flex flex-col items-end gap-3">
            {entry.source === 'official' ? (
              <div className="px-4 py-2 rounded-full bg-white/10 border border-white/10 flex items-center gap-2 shrink-0">
                <span className="material-symbols-outlined text-white text-sm">verified</span>
                <span className="text-xs font-semibold text-white">Verified source</span>
              </div>
            ) : null}
            
            <button 
              onClick={(e) => { e.stopPropagation(); navigate(`/app/product/${entry.productId}`); }}
              className="px-4 py-2 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg"
            >
              Product info
            </button>
          </div>
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

=======
>>>>>>> 5fac94b80409dd1f2e78730c8fe497e5c36959fb
  return (
    <div
      className="bg-white border border-border-soft rounded-2xl p-4 cursor-pointer hover:border-text-main/15 hover:shadow-sm transition-all duration-200"
      onClick={() => navigate(`/app/price/${entry.id}`)}
    >
      <div className="flex items-center gap-4">
        {/* Product icon */}
        <div className="w-11 h-11 rounded-xl bg-bg-muted flex items-center justify-center text-text-muted shrink-0">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>

        {/* Product + store info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-text-main truncate">
              {entry.product?.name ?? 'Unknown product'}
            </p>
            {isBest && (
              <span className="px-1.5 py-0.5 bg-green-500/10 text-green-600 text-[10px] font-semibold rounded shrink-0">
                Best
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted mt-0.5 truncate">
            {entry.store?.name}
            {entry.store?.district ? ` · ${entry.store.district}` : ''}
            {' · '}{timeAgo(entry.createdAt)}
          </p>
        </div>

        {/* Price + add to list */}
        <div className="text-right shrink-0 flex items-center gap-3">
          <div>
            <p className="text-base font-bold text-text-main font-data">
              {entry.priceLbp.toLocaleString()}
              <span className="text-xs font-normal text-text-muted ml-1">LBP</span>
            </p>
            <p className="text-xs text-text-muted mt-0.5">${usdPrice}</p>
          </div>

          <button
            className="w-8 h-8 rounded-lg bg-bg-muted hover:bg-primary hover:text-white text-text-muted flex items-center justify-center transition-all shrink-0"
            onClick={handleAddToList}
            type="button"
            title="Add to list"
          >
            <span className="material-symbols-outlined text-[16px]">playlist_add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const PriceResultCard = React.memo(PriceResultCardBase);
