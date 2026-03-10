import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEnrichedPriceEntries, getEnrichedFeedback } from '@/api/mockData';
import { timeAgo, formatLBP } from '@/lib/utils';
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

  const addItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);
  const { rateLbpPerUsd } = useExchangeRateStore();

  const entry = getEnrichedPriceEntries().find((e) => e.id === id);
  const feedbacks = getEnrichedFeedback().filter((f) => f.priceEntryId === id);

  if (!entry) return <NotFoundPage />;

  const usdPrice = (entry.priceLbp / rateLbpPerUsd).toFixed(2);

  const handleAddToCart = () => {
    addItem(entry.productId);
    addToast(`${entry.product?.name ?? 'Item'} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-12 md:py-16 animate-page">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col gap-8">

          {/* HEADER */}
          <header className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-lg bg-bg-muted border border-border-soft flex items-center justify-center hover:bg-bg-surface transition"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>

            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              Verified entry
            </p>
          </header>

          {/* PRODUCT CARD */}
          <section className="card p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8">

              {/* IMAGE */}
              <div className="w-36 h-36 md:w-44 md:h-44 bg-bg-muted rounded-2xl flex items-center justify-center border border-border-soft">
                <span className="material-symbols-outlined text-5xl text-text-muted/30">
                  inventory_2
                </span>
              </div>

              {/* INFO */}
              <div className="flex-1 flex flex-col">

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-bg-muted text-text-sub text-xs font-semibold rounded-full">
                    {entry.product?.category}
                  </span>

                  <StatusBadge status={entry.status} />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-2">
                  {entry.product?.name}
                </h1>

                <p className="text-sm text-text-muted mb-6">
                  {entry.product?.unit}
                </p>

                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-text-muted">
                    storefront
                  </span>

                  <div className="flex flex-col">
                    <span className="font-semibold text-text-main">
                      {entry.store?.name}
                    </span>
                    <span className="text-xs text-text-muted">
                      {entry.store?.district}
                    </span>
                  </div>
                </div>

                <div className="mt-auto flex items-end justify-between">

                  <div>
                    <p className="text-xs text-text-muted mb-1">
                      Observed price
                    </p>

                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold font-data text-text-main">
                        {entry.priceLbp.toLocaleString()}
                      </span>

                      <span className="text-sm text-text-muted">LBP</span>
                    </div>

                    <p className="text-sm text-text-muted">
                      ≈ ${usdPrice}
                    </p>
                  </div>

                  <span className="text-xs text-text-muted">
                    Updated {timeAgo(entry.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* PRICE HISTORY */}
          <section className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-main">
                Price trend
              </h2>

              <span className="text-xs text-green-600 font-semibold">
                Stable
              </span>
            </div>

            <div className="h-[200px]">
              <PriceHistoryChart
                data={[
                  { date: 'Feb 10', price: 120000 },
                  { date: 'Feb 15', price: 135000 },
                  { date: 'Feb 20', price: 130000 },
                  { date: 'Feb 25', price: 128000 },
                  { date: 'Mar 01', price: 125000 },
                  { date: 'Mar 06', price: 125000 },
                ]}
              />
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="w-full lg:w-[340px] flex flex-col gap-6">

          {/* ACTION CARD */}
          <div className="card-dark p-8">
            <h2 className="text-lg font-bold text-white mb-6">
              Verification
            </h2>

            <div className="space-y-4 mb-8">

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-white/50 mb-1">
                  Community confirmations
                </p>

                <p className="text-2xl font-bold text-white">
                  {entry.upvotes}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-white/50 mb-1">
                  Trust level
                </p>

                <p className="text-xl font-bold text-green-400">
                  High
                </p>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full h-12 rounded-xl bg-white text-text-main font-semibold hover:opacity-90 transition"
            >
              Add to cart
            </button>
          </div>

          {/* FEEDBACK */}
          <div>
            <p className="text-xs font-semibold text-text-muted mb-4">
              Community notes
            </p>

            <div className="space-y-4">
              {feedbacks.length > 0 ? (
                feedbacks.map((fb, i) => (
                  <motion.div
                    key={fb.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <FeedbackCard feedback={fb} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 text-text-muted">
                  No community feedback yet.
                </div>
              )}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}