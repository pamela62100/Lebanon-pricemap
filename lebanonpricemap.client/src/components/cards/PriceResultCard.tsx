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

const POWER_STYLES: Record<string, { label: string; icon: string; className: string }> = {
  stable:        { label: 'Power OK',    icon: 'bolt',          className: 'text-green-600 bg-green-500/10' },
  unstable:      { label: 'Power cuts',  icon: 'bolt',          className: 'text-amber-600 bg-amber-400/10' },
  reported_warm: { label: 'Warm stock',  icon: 'device_thermostat', className: 'text-red-500 bg-red-500/10' },
};

const PriceResultCardBase = ({ entry, index }: PriceResultCardProps) => {
  const navigate = useNavigate();
  const { rateLbpPerUsd } = useExchangeRateStore();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  const usdPrice = (entry.priceLbp / rateLbpPerUsd).toFixed(2);
  const isBest = index === 0;
  const icon = CATEGORY_ICONS[entry.product?.category ?? ''] ?? 'inventory_2';
  const power = entry.store?.powerStatus ? POWER_STYLES[entry.store.powerStatus] : null;
  const isOutOfStock = (entry as any).isInStock === false;

  const handleAddToList = (event: React.MouseEvent) => {
    event.stopPropagation();
    addItem(entry.productId);
    addToast(`${entry.product?.name ?? 'Item'} added to list`);
  };

  return (
    <div
      className={`bg-white border rounded-2xl p-4 cursor-pointer hover:border-text-main/15 hover:shadow-sm transition-all duration-200 ${isOutOfStock ? 'opacity-60 border-border-soft' : 'border-border-soft'}`}
      onClick={() => navigate(`/app/price/${entry.id}`)}
    >
      <div className="flex items-center gap-4">
        {/* Product icon */}
        <div className="w-11 h-11 rounded-xl bg-bg-muted flex items-center justify-center text-text-muted shrink-0 relative">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
          {isOutOfStock && (
            <div className="absolute inset-0 rounded-xl bg-white/60 flex items-center justify-center">
              <span className="material-symbols-outlined text-[14px] text-red-400">remove_shopping_cart</span>
            </div>
          )}
        </div>

        {/* Product + store info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-semibold text-text-main truncate">
              {entry.product?.name ?? 'Unknown product'}
            </p>
            {isBest && !isOutOfStock && (
              <span className="px-1.5 py-0.5 bg-green-500/10 text-green-600 text-[10px] font-semibold rounded shrink-0">
                Best
              </span>
            )}
            {entry.isPromotion && !isOutOfStock && (
              <span className="px-1.5 py-0.5 bg-orange-500/10 text-orange-600 text-[10px] font-semibold rounded shrink-0">
                Sale
              </span>
            )}
            {isOutOfStock && (
              <span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-semibold rounded shrink-0">
                Out of stock
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-xs text-text-muted truncate">
              {entry.store?.name}
              {entry.store?.district ? ` · ${entry.store.district}` : ''}
              {' · '}{timeAgo(entry.createdAt)}
            </p>
            {entry.store?.isVerifiedRetailer && (
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-primary shrink-0">
                <span className="material-symbols-outlined text-[11px]">verified</span>
                Verified
              </span>
            )}
            {power && power.label !== 'Power OK' && (
              <span className={`flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${power.className}`}>
                <span className="material-symbols-outlined text-[11px]">{power.icon}</span>
                {power.label}
              </span>
            )}
          </div>
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
            disabled={isOutOfStock}
          >
            <span className="material-symbols-outlined text-[16px]">playlist_add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const PriceResultCard = React.memo(PriceResultCardBase);
