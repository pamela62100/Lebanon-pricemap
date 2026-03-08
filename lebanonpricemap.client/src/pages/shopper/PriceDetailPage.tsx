import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEnrichedPriceEntries, getEnrichedFeedback } from '@/api/mockData';
import { timeAgo, formatLBP, cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriceHistoryChart } from '@/components/charts/PriceHistoryChart';
import { FeedbackCard } from '@/components/cards/FeedbackCard';
import { NotFoundPage } from '@/pages/shared/NotFoundPage';

export function PriceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const entry = getEnrichedPriceEntries().find(e => e.id === id);
  const feedbacks = getEnrichedFeedback().filter(f => f.priceEntryId === id);

  if (!entry) return <NotFoundPage />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* Main Column */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Back navigation & Header */}
        <button onClick={() => navigate(-1)} className="w-fit flex items-center gap-2 text-text-muted hover:text-text-main font-semibold transition-colors mb-2">
          <span className="material-symbols-outlined">arrow_back</span> Back to Results
        </button>

        <div className="bg-bg-surface border border-border-soft rounded-3xl p-8 shadow-sm relative overflow-hidden">
          {entry.isPromotion && (
            <div className="absolute top-0 right-0 bg-[var(--status-pending-text)] text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-md">
              PROMOTION
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-48 h-48 bg-bg-muted rounded-2xl flex items-center justify-center shrink-0 border border-border-soft">
              <span className="text-6xl text-text-muted font-bold opacity-30">IMG</span>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-primary-soft text-primary text-xs font-bold rounded-lg">{entry.product?.category}</span>
                  <StatusBadge status={entry.status} />
                </div>
                <h1 className="text-3xl font-bold text-text-main mb-1">{entry.product?.name}</h1>
                <p className="text-xl text-text-muted mb-4">{entry.product?.unit}</p>
                <div className="flex items-center gap-2 text-text-sub font-medium mb-1">
                  <span className="material-symbols-outlined text-primary">storefront</span>
                  {entry.store?.name} · {entry.store?.region}
                </div>
                <div className="flex items-center gap-2 text-text-muted text-sm border-l-2 border-border-primary pl-3 mt-4">
                  Confirmed by community
                  <span className="font-bold text-[var(--status-verified-text)]">{entry.upvotes} times</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-end border-t border-border-soft pt-6">
                <span className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-1">Current Price</span>
                <span className="text-4xl font-display font-bold text-text-main tracking-tight">
                  <span className="text-lg text-text-muted font-sans font-medium mr-1.5">LBP</span>
                  {formatLBP(entry.priceLbp).replace('LBP', '').trim()}
                </span>
                <span className="text-xs text-text-sub mt-2">Updated {timeAgo(entry.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* History Chart */}
        <div className="bg-bg-surface border border-border-soft rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">show_chart</span>
            Price Trend
          </h2>
          <PriceHistoryChart data={[
            { date: 'Feb 10', price: 120000 },
            { date: 'Feb 15', price: 135000 },
            { date: 'Feb 20', price: 130000 },
            { date: 'Feb 25', price: 128000 },
            { date: 'Mar 01', price: 125000 },
            { date: 'Mar 06', price: 125000 },
          ]} />
        </div>
      </div>

      {/* Sidebar - Community Feedback */}
      <aside className="w-full lg:w-[400px] shrink-0 flex flex-col gap-6">
        <div className="bg-bg-surface border border-border-soft rounded-3xl p-6 shadow-sm sticky top-24">
          <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">forum</span>
            Community Notes
          </h2>
          
          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
            {feedbacks.length > 0 ? feedbacks.map((fb, i) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={fb.id}
              >
                <FeedbackCard feedback={fb} />
              </motion.div>
            )) : (
              <div className="text-sm text-text-muted text-center py-12 border-2 border-dashed border-border-soft rounded-2xl">
                No notes or flags yet.<br/>Be the first to verify this price!
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 pt-6 border-t border-border-soft">
             <button className="h-12 w-full rounded-xl bg-[var(--status-verified-text)] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>thumb_up</span>
                Verify Price
             </button>
             <button className="h-12 w-full rounded-xl border border-border-primary text-text-sub font-bold hover:bg-bg-muted hover:text-text-main transition-all">
                Report Incorrect
             </button>
          </div>
        </div>
      </aside>

    </motion.div>
  );
}
