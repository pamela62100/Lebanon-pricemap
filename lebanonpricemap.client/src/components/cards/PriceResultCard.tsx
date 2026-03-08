import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { PriceEntry } from '@/types';
import { formatLBP, timeAgo, cn } from '@/lib/utils';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';
import { useCartStore } from '@/store/useCartStore';
import { useLocationStore } from '@/store/useLocationStore';
import { useToastStore } from '@/store/useToastStore';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { distanceKm, formatDistance } from '@/lib/distanceUtils';

interface PriceResultCardProps {
  entry: PriceEntry;
  index: number;
}

const PriceResultCardBase = ({ entry, index }: PriceResultCardProps) => {
  const navigate = useNavigate();
  const { rateLbpPerUsd } = useExchangeRateStore();
  const { lat, lng } = useLocationStore();
  const addItem = useCartStore(s => s.addItem);
  const addToast = useToastStore(s => s.addToast);
  const { open } = useRouteDialog();

  const usdPrice = (entry.priceLbp / rateLbpPerUsd).toFixed(2);
  const storeRate = entry.store?.internalRateLbp ?? rateLbpPerUsd;
  const rateDiff = storeRate - rateLbpPerUsd;
  const isRateFair = Math.abs(rateDiff) < 500;

  const showsFridge = entry.product?.category === 'Dairy' || entry.product?.category === 'Meat';
  const powerStatus = entry.store?.powerStatus ?? 'stable';

  const distance = lat && lng && entry.store?.latitude && entry.store?.longitude
    ? distanceKm(lat, lng, entry.store.latitude, entry.store.longitude)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(entry.productId);
    addToast(`${entry.product?.name ?? 'Item'} added ✓`, 'success');
  };

  const storeInitials = entry.store?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/app/price/${entry.id}`)}
      className={cn(
        "group p-8 bg-bg-surface border border-border-primary hover:border-primary transition-all relative cursor-pointer",
        "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary/20 hover:before:bg-primary before:transition-all",
        "hover:-translate-y-1 hover:shadow-xl"
      )}
    >
      <div className="flex gap-8">
        {/* Gallery Avatar */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="w-14 h-14 bg-bg-muted border border-border-primary/10 flex items-center justify-center text-primary font-serif font-black text-sm italic rounded-full group-hover:bg-primary group-hover:text-white transition-all">
            {storeInitials}
          </div>
          {entry.status === 'verified' && (
             <span className="text-[10px] font-black text-primary uppercase tracking-widest">Verified</span>
          )}
        </div>

        {/* Archival Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
             <h3 className="font-serif text-2xl font-black text-text-main italic truncate leading-tight">
               {entry.store?.name}
             </h3>
             <div className="text-right shrink-0 ml-4">
                <p className="text-2xl font-serif font-black text-primary leading-none tabular-nums">
                   {entry.priceLbp.toLocaleString()}
                </p>
                <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mt-1">LBP_CURRENCY</p>
             </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-bold text-text-sub uppercase tracking-widest mb-4">
             <span>{entry.store?.district}</span>
             <span className="w-1 h-1 rounded-full bg-border-primary" />
             <span className="text-primary">{entry.product?.category}</span>
          </div>

          <div className="flex items-center gap-3 text-[9px] font-bold text-text-muted uppercase tracking-tighter">
             <span className="material-symbols-outlined text-[14px]">history</span>
             Captured {timeAgo(entry.createdAt)}
             {distance && (
                <>
                  <span className="w-1 h-1 rounded-full bg-border-primary/40" />
                  <span className="text-primary/70">{formatDistance(distance)} offset</span>
                </>
             )}
          </div>
        </div>
      </div>

      {/* Boutique Metadata strip */}
      {(showsFridge || !isRateFair) && (
        <div className="mt-8 pt-6 border-t border-border-soft flex flex-wrap gap-4">
          {showsFridge && (
            <div className={cn(
              "px-3 py-1 text-[9px] font-black uppercase tracking-widest border",
              powerStatus === 'stable' ? "text-status-verified-text border-status-verified-text/20 bg-status-verified-text/5" : "text-status-flagged-text border-status-flagged-text/20 bg-status-flagged-text/5"
            )}>
              {powerStatus === 'stable' ? 'Cold Chain Protocol: Stable' : 'Cold Chain Protocol: Compromised'}
            </div>
          )}
          {!isRateFair && (
            <div className="px-3 py-1 text-[9px] font-black text-primary uppercase tracking-widest border border-primary/20 bg-primary/5">
              Warning: Higher Internal Store Rate
            </div>
          )}
        </div>
      )}

      {/* Interactive Overlay Strip */}
      <div className="mt-8 pt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
        <div className="flex gap-4">
           <button
            onClick={(e) => { e.stopPropagation(); open('report-price', { id: entry.id }); }}
            className="text-[9px] font-black underline underline-offset-4 text-text-muted hover:text-red-600 transition-colors uppercase tracking-[0.2em]"
          >
            FLAG_INACCURACY
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); open('report-reality', { storeId: entry.storeId, type: 'market' }); }}
            className="text-[9px] font-black underline underline-offset-4 text-text-muted hover:text-primary transition-colors uppercase tracking-[0.2em]"
          >
             REFINE_LOCATION_DATA
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          className="h-11 px-8 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-black transition-all shadow-lg"
        >
          Add to Collection
        </button>
      </div>
    </motion.div>
  );
};

export const PriceResultCard = React.memo(PriceResultCardBase);
