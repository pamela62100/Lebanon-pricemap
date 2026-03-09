import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEnrichedPriceEntries, getEnrichedFeedback } from '@/api/mockData';
import { timeAgo, formatLBP, cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriceHistoryChart } from '@/components/charts/PriceHistoryChart';
import { FeedbackCard } from '@/components/cards/FeedbackCard';
import { NotFoundPage } from '@/pages/shared/NotFoundPage';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';

export function PriceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(s => s.addItem);
  const addToast = useToastStore(s => s.addToast);
  const { rateLbpPerUsd } = useExchangeRateStore();

  const entry = getEnrichedPriceEntries().find(e => e.id === id);
  const feedbacks = getEnrichedFeedback().filter(f => f.priceEntryId === id);

  if (!entry) return <NotFoundPage />;

  const usdPrice = (entry.priceLbp / rateLbpPerUsd).toFixed(2);

  const handleAddToCart = () => {
    addItem(entry.productId);
    addToast(`${entry.product?.name ?? 'Item'} added to dossier ✓`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-12 md:py-20 animate-page">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Main Sector: Intelligence Report */}
        <div className="flex-1 flex flex-col gap-8">
          <header className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-bg-muted text-text-muted hover:text-text-main flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-border-soft"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-60">Verified_Tactical_Entry</p>
            </div>
          </header>

          <section className="card p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity">
               <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 10 L 100 0 L 100 100 L 0 90 Z" fill="currentColor" />
               </svg>
            </div>

            {entry.isPromotion && (
              <div className="absolute top-0 right-0 px-5 py-1.5 bg-text-main text-white text-[9px] font-bold uppercase tracking-widest rounded-bl-xl shadow-lg">
                Promotion_Protocol
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-10 relative z-10">
              <div className="w-40 h-40 md:w-48 md:h-48 bg-bg-muted rounded-[2rem] flex items-center justify-center shrink-0 border border-border-soft shadow-inner overflow-hidden relative">
                <span className="material-symbols-outlined text-6xl text-text-muted/10">inventory_2</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                   <div className="px-3 py-1 bg-text-main text-white text-[8px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-text-main/5">
                     {entry.product?.category}
                   </div>
                   <StatusBadge status={entry.status} />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-text-main tracking-tighter leading-none mb-3">
                  {entry.product?.name}
                </h1>
                <p className="text-[10px] font-bold text-text-muted mb-6 uppercase tracking-[0.15em] opacity-40">
                  {entry.product?.unit} // REF_ID: {entry.id.slice(0, 8)}
                </p>

                <div className="flex items-center gap-3 text-text-main font-bold mb-8 p-4 bg-bg-muted/50 rounded-xl border border-border-soft/50 w-fit">
                  <span className="material-symbols-outlined text-xl opacity-40">storefront</span>
                  <div className="flex flex-col gap-0">
                    <span className="text-base tracking-tight">{entry.store?.name}</span>
                    <span className="text-[9px] text-text-muted uppercase tracking-widest font-medium opacity-60">{entry.store?.district} · Beirut</span>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-border-soft/50 flex flex-col md:flex-row md:items-end justify-between gap-6">
                   <div className="space-y-1">
                      <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-60">Observation_Price</p>
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                           <span className="text-5xl font-bold text-text-main font-data tracking-tighter leading-none">
                             {entry.priceLbp.toLocaleString()}
                           </span>
                           <span className="text-lg font-bold text-text-muted uppercase tracking-widest opacity-40">LBP</span>
                        </div>
                        <p className="text-xl font-bold text-text-muted font-data tracking-tight opacity-30">≈ ${usdPrice}</p>
                      </div>
                   </div>
                   <div className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-40">
                     Protocol_Update {timeAgo(entry.createdAt)}
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trend Engine */}
          <section className="card p-8 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-bg-muted to-transparent pointer-events-none" />
            <div className="flex items-center justify-between mb-8 relative z-10">
               <h2 className="text-lg font-bold text-text-main flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-muted flex items-center justify-center border border-border-soft">
                    <span className="material-symbols-outlined text-base text-text-muted">analytics</span>
                  </div>
                  Price Volatility Trend
               </h2>
               <div className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[8px] font-bold uppercase tracking-widest border border-green-500/20">
                 Stability_Confirmed
               </div>
            </div>
            <div className="relative z-10 h-[200px]">
              <PriceHistoryChart data={[
                { date: 'Feb 10', price: 120000 },
                { date: 'Feb 15', price: 135000 },
                { date: 'Feb 20', price: 130000 },
                { date: 'Feb 25', price: 128000 },
                { date: 'Mar 01', price: 125000 },
                { date: 'Mar 06', price: 125000 },
              ]} />
            </div>
          </section>
        </div>

        {/* Sidebar Sector: Verification Network */}
        <aside className="w-full lg:w-[340px] flex flex-col gap-6">
          <div className="card-dark p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-xl">
                <span className="material-symbols-outlined text-white text-xl">security</span>
              </div>
              Nexus Verification
            </h2>

            <div className="grid grid-cols-1 gap-3 mb-8 relative z-10">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300">
                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5">Community_Consensus</p>
                 <p className="text-2xl font-bold text-white font-data tracking-tight">{entry.upvotes} Confirmations</p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300">
                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5">Trust_Level</p>
                 <p className="text-2xl font-bold text-status-verified font-data tracking-tight">High Fidelity</p>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <button 
                onClick={handleAddToCart}
                className="w-full h-14 rounded-xl bg-white text-text-main font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5 uppercase tracking-widest text-[10px]"
              >
                <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                Add to Dossier
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button className="w-full h-12 rounded-xl bg-white/5 text-white font-bold flex items-center justify-center gap-2 border border-white/10 hover:bg-white/15 transition-all text-[9px] uppercase tracking-widest">
                  <span className="material-symbols-outlined text-base opacity-40">thumb_up</span>
                  Verify
                </button>
                <button className="w-full h-12 rounded-xl bg-white/5 text-white font-bold flex items-center justify-center gap-2 border border-white/10 hover:bg-white/15 transition-all text-[9px] uppercase tracking-widest group">
                  <span className="material-symbols-outlined text-base opacity-40 group-hover:text-red-400 transition-colors">flag</span>
                  Report
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-2">
             <div className="flex items-center justify-between">
               <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-60">Field_Notes</p>
               <div className="w-1.5 h-1.5 rounded-full bg-border-soft" />
             </div>
             <div className="space-y-4">
                {feedbacks.length > 0 ? feedbacks.map((fb, i) => (
                  <motion.div key={fb.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <FeedbackCard feedback={fb} />
                  </motion.div>
                )) : (
                  <div className="py-16 flex flex-col items-center opacity-20 text-center bg-bg-muted/30 rounded-[2rem] border border-dashed border-border-soft">
                    <span className="material-symbols-outlined text-4xl mb-3">analytics</span>
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] leading-loose">
                      No field intelligence <br /> available yet.
                    </p>
                  </div>
                )}
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}