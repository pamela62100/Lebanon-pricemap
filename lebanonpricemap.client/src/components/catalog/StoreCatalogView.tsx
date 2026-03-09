import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { catalogApi } from '@/api/catalog.api';
import { CatalogDiscrepancyDialog } from '@/components/dialogs/CatalogDiscrepancyDialog';
import type { CatalogProduct } from '@/types/catalog.types';
import { cn } from '@/lib/utils';
import { useToastStore } from '@/store/useToastStore';
import { timeAgo } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';

interface StoreCatalogViewProps {
  storeId: string;
  storeName: string;
  isVerified: boolean;
}

const DAYS_STALE = 3;

function isStale(lastUpdatedAt: string): boolean {
  const daysSince = (Date.now() - new Date(lastUpdatedAt).getTime()) / (1000 * 60 * 60 * 24);
  return daysSince > DAYS_STALE;
}

const CATEGORY_ICONS: Record<string, string> = {
  Dairy: 'water_drop',
  Bakery: 'bakery_dining',
  Oil: 'opacity',
  Meat: 'kebab_dining',
  Grains: 'grain',
  Produce: 'nutrition',
  Fuel: 'local_gas_station',
  Beverages: 'local_drink',
};

function CatalogProductCard({
  cp,
  index,
  onReport,
}: {
  cp: CatalogProduct;
  index: number;
  onReport: (cp: CatalogProduct) => void;
}) {
  const effectivePrice = cp.isPromotion && cp.promoPriceLbp ? cp.promoPriceLbp : cp.officialPriceLbp;
  const stale = isStale(cp.lastUpdatedAt);
  const promoExpired = cp.isPromotion && cp.promoEndsAt && new Date(cp.promoEndsAt) < new Date();
  const icon = CATEGORY_ICONS[cp.productCategory] || 'inventory_2';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        "card p-6 flex flex-col group transition-all",
        !cp.isInStock && "opacity-60 grayscale-[0.5]"
      )}
    >
      {/* Badge Area */}
      <div className="flex items-center gap-2 mb-6">
        <div className={cn(
          "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest",
          cp.isInStock ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
        )}>
          {cp.isInStock ? "In Stock" : "Unavailable"}
        </div>
        {cp.isPromotion && !promoExpired && (
          <div className="px-2.5 py-1 rounded-full bg-text-main/10 text-text-main text-[9px] font-bold uppercase tracking-widest flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">local_offer</span>
            Promo
          </div>
        )}
        {stale && (
          <div className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[9px] font-bold uppercase tracking-widest">
            Pending_Verification
          </div>
        )}
      </div>

      <div className="flex items-start gap-5 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-bg-muted flex items-center justify-center text-text-muted shrink-0 group-hover:bg-bg-base transition-colors">
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-text-main leading-tight mb-1 truncate">{cp.productName}</h3>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">{cp.productCategory} // {cp.productUnit}</p>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-border-soft flex items-end justify-between">
         <div>
            <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Official_Price</p>
            <div className="flex items-baseline gap-2">
               <span className="text-3xl font-bold text-text-main font-data tracking-tighter">
                 {effectivePrice.toLocaleString()}
               </span>
               <span className="text-[10px] font-bold text-text-muted uppercase">LBP</span>
            </div>
            {cp.isPromotion && cp.promoPriceLbp && !promoExpired && (
              <span className="text-[11px] font-bold text-text-muted/40 line-through tabular-nums">
                LBP {cp.officialPriceLbp.toLocaleString()}
              </span>
            )}
         </div>

         <button
           onClick={() => onReport(cp)}
           className="w-10 h-10 rounded-xl bg-bg-muted flex items-center justify-center text-text-muted hover:bg-red-500 hover:text-white transition-all shadow-sm"
           title="Report Discrepancy"
         >
           <span className="material-symbols-outlined text-xl">flag</span>
         </button>
      </div>
      
      <p className="mt-4 text-[9px] font-bold text-text-muted/30 uppercase tracking-[0.2em]">
        Updated {timeAgo(cp.lastUpdatedAt)}
      </p>
    </motion.div>
  );
}

export function StoreCatalogView({ storeId, storeName, isVerified }: StoreCatalogViewProps) {
  const addToast = useToastStore(s => s.addToast);
  const [reportTarget, setReportTarget] = useState<CatalogProduct | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const products = useMemo(() => catalogApi.getByStore(storeId), [storeId]);
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.productCategory)));
    return ['All', ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(p => p.productCategory === activeCategory);
  }, [products, activeCategory]);

  const inStockCount = products.filter(p => p.isInStock).length;

  if (!isVerified) {
    return (
      <EmptyState 
        icon="storefront" 
        title="Restricted Catalog" 
        subtitle={`${storeName} is not an official partner. Use the main search to find crowdsourced tactical data for this location.`}
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState 
        icon="inventory_2" 
        title="Zero inventory" 
        subtitle="This retailer has not published any entries to the official feed yet."
      />
    );
  }

  return (
    <div className="space-y-10">
      {/* Header Intel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-text-main tracking-tight mb-2">Official Catalog</h2>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
               Live_Inventory
             </div>
             <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
               {inStockCount} / {products.length} Entries Active
             </p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[11px] font-bold transition-all border",
                activeCategory === cat
                  ? "bg-text-main text-white border-text-main shadow-lg shadow-text-main/10"
                  : "bg-white text-text-muted border-border-soft hover:border-text-main/20"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((cp, i) => (
          <CatalogProductCard
            key={cp.id}
            cp={cp}
            index={i}
            onReport={setReportTarget}
          />
        ))}
      </div>

      {/* Report dialog */}
      {reportTarget && (
        <CatalogDiscrepancyDialog
          product={reportTarget}
          storeId={storeId}
          isOpen={!!reportTarget}
          onClose={() => setReportTarget(null)}
          onSubmitted={() => {
            addToast('Intelligence report received. Verification pending.', 'success');
          }}
        />
      )}
    </div>
  );
}
