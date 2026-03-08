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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 p-6">

      {/* Main Column */}
      <div className="flex-1 flex flex-col gap-5">

        <button onClick={() => navigate(-1)} className="w-fit flex items-center gap-2 text-text-muted hover:text-text-main font-semibold transition-colors text-sm">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Results
        </button>

        <div className="bg-bg-surface border border-border-soft rounded-2xl p-7 shadow-sm relative overflow-hidden">
          {entry.isPromotion && (
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
              PROMOTION
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-7">
            <div className="w-40 h-40 bg-bg-muted rounded-2xl flex items-center justify-center shrink-0 border border-border-soft">
              <span className="text-5xl text-text-muted opacity-30">IMG</span>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">{entry.product?.category}</span>
                  <StatusBadge status={entry.status} />
                </div>
                <h1 className="text-2xl font-black text-text-main mb-1">{entry.product?.name}</h1>
                <p className="text-base text-text-muted mb-3">{entry.product?.unit}</p>
                <div className="flex items-center gap-2 text-sm text-text-sub font-medium mb-1">
                  <span className="material-symbols-outlined text-primary text-[18px]">storefront</span>
                  {entry.store?.name} · {entry.store?.region}
                </div>
                <div className="flex items-center gap-2 text-text-muted text-sm border-l-2 border-primary pl-3 mt-3">
                  Confirmed by community
                  <span className="font-bold text-green-600">{entry.upvotes} times</span>
                </div>
              </div>

              <div className="mt-5 flex flex-col items-end border-t border-border-soft pt-5">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Current Price</span>
                <span className="text-3xl font-black text-text-main">
                  <span className="text-base text-text-muted font-medium mr-1">LBP</span>
                  {formatLBP(entry.priceLbp).replace('LBP', '').trim()}
                </span>
                <span className="text-xs text-text-sub mt-1">Updated {timeAgo(entry.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Chart */}
        <div className="bg-bg-surface border border-border-soft rounded-2xl p-7 shadow-sm">
          <h2 className="text-base font-black text-text-main mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">show_chart</span>
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

      {/* Sidebar */}
      <aside className="w-full lg:w-[380px] shrink-0 flex flex-col gap-5">
        <div className="bg-bg-surface border border-border-soft rounded-2xl p-5 shadow-sm sticky top-24">
          <h2 className="text-base font-black text-text-main mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">forum</span>
            Community Notes
          </h2>

          <div className="flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-1 scrollbar-hide">
            {feedbacks.length > 0 ? feedbacks.map((fb, i) => (
              <motion.div key={fb.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <FeedbackCard feedback={fb} />
              </motion.div>
            )) : (
              <div className="text-sm text-text-muted text-center py-10 border-2 border-dashed border-border-soft rounded-xl">
                No notes yet.<br />Be the first to verify this price!
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-2 pt-5 border-t border-border-soft">
            <button className="h-11 w-full rounded-xl bg-green-600 text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm shadow-md">
              <span className="material-symbols-outlined text-[18px]">thumb_up</span>
              Verify Price
            </button>
            <button className="h-11 w-full rounded-xl border border-border-primary text-text-sub font-bold hover:bg-bg-muted hover:text-text-main transition-all text-sm">
              Report Incorrect
            </button>
          </div>
        </div>
      </aside>
    </motion.div>
  );
}