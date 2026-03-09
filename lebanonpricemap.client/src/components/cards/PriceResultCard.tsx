import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { PriceEntry } from '@/types';
import { formatLBP, timeAgo, cn } from '@/lib/utils';
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
  const addItem = useCartStore(s => s.addItem);
  const addToast = useToastStore(s => s.addToast);

  const usdPrice = (entry.priceLbp / rateLbpPerUsd).toFixed(2);
  const isHero = index === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(entry.productId);
    addToast(`${entry.product?.name ?? 'Item'} added to dossier ✓`, 'success');
  };

  const storeInitials = entry.store?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'SN';

  if (isHero) {
    return (
      <div 
        className="card-dark p-8 cursor-pointer group relative overflow-hidden transition-all duration-500 hover:scale-[1.01]" 
        onClick={() => navigate(`/app/price/${entry.id}`)}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-primary/20 to-transparent" />
        
        <div className="relative z-10 flex items-start justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">
              Best_Market_Entry // {entry.product?.category}
            </p>
            <h3 className="text-3xl font-bold text-white tracking-tighter leading-none mb-2 group-hover:text-primary transition-colors">
              {entry.store?.name}
            </h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{entry.store?.district}</p>
          </div>
          {entry.source === 'official' && (
            <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 shadow-2xl flex items-center gap-2">
              <span className="material-symbols-outlined text-white text-sm">verified</span>
              <span className="text-[9px] font-bold text-white uppercase tracking-widest">Verified_Source</span>
            </div>
          )}
        </div>

        <div className="relative z-10 flex flex-col gap-1">
          <div className="flex items-baseline gap-3">
            <span className="font-data text-6xl text-white tracking-tighter leading-none">
              {entry.priceLbp.toLocaleString()}
            </span>
            <span className="text-xl font-bold text-white/40 uppercase tracking-widest">LBP</span>
          </div>
          <p className="text-lg font-bold text-white/30 font-data tracking-tight">≈ ${usdPrice}</p>
        </div>

        <div className="relative z-10 flex items-center justify-between mt-12 pt-8 border-t border-white/5">
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">
            Broadcasted // {timeAgo(entry.createdAt)}
          </p>
          <button 
            className="w-14 h-14 rounded-2xl bg-white text-text-main flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl"
            onClick={handleAddToCart}
          >
             <span className="material-symbols-outlined text-2xl">add_shopping_cart</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="card p-6 cursor-pointer group hover:bg-bg-muted/50 transition-all duration-300" 
      onClick={() => navigate(`/app/price/${entry.id}`)}
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-bg-muted flex items-center justify-center text-xs font-bold text-text-muted transition-all group-hover:bg-text-main group-hover:text-white group-hover:rotate-12">
            {storeInitials}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <p className="text-lg font-bold text-text-main tracking-tight group-hover:text-primary transition-colors">{entry.store?.name}</p>
              {entry.source === 'official' && (
                 <span className="material-symbols-outlined text-text-muted text-base">verified</span>
              )}
            </div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1 opacity-50">
              {entry.store?.district} · {timeAgo(entry.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-baseline gap-2 justify-end">
            <span className="font-data text-3xl text-text-main font-bold tracking-tighter">
              {entry.priceLbp.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">LBP</span>
          </div>
          <p className="text-sm font-bold text-text-muted font-data opacity-40">≈ ${usdPrice}</p>
        </div>
      </div>
    </div>
  );
};

export const PriceResultCard = React.memo(PriceResultCardBase);