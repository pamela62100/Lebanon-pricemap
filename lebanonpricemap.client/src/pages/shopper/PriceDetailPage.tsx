import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEnrichedPriceEntries, getEnrichedFeedback } from '@/api/mockData';
import { timeAgo } from '@/lib/utils';
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
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);
  const { rateLbpPerUsd } = useExchangeRateStore();

  const entry = getEnrichedPriceEntries().find((priceEntry) => priceEntry.id === id);
  const feedbacks = getEnrichedFeedback().filter((feedback) => feedback.priceEntryId === id);

  if (!entry) return <NotFoundPage />;

  const usdPrice = (entry.priceLbp / rateLbpPerUsd).toFixed(2);

  const handleAddToCart = () => {
    addItem(entry.productId);
    addToast(`${entry.product?.name ?? 'Item'} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-12 md:py-20 animate-page">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 flex flex-col gap-8">
          <header className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-full bg-bg-muted text-text-muted hover:text-text-main flex items-center justify-center transition-all border border-border-soft"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs font-semibold text-text-muted">Verified price entry</p>
            </div>
          </header>

          <section className="card p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="w-40 h-40 md:w-48 md:h-48 bg-bg-muted rounded-[2rem] flex items-center justify-center shrink-0 border border-border-soft">
                <span className="material-symbols-outlined text-6xl text-text-muted/20">
                  inventory_2
                </span>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <div className="px-3 py-1 bg-text-main text-white text-[10px] font-bold rounded-full">
                    {entry.product?.category}
                  </div>
                  <StatusBadge status={entry.status} />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight mb-3">
                  {entry.product?.name}
                </h1>

                <p className="text-sm text-text-muted mb-6">
                  {entry.product?.unit}
                </p>

                <div className="flex items-center gap-3 text-text-main font-bold mb-8 p-4 bg-bg-muted/50 rounded-2xl border border-border-soft w-fit">
                  <span className="material-symbols-outlined text-xl opacity-50">storefront</span>
                  <div className="flex flex-col gap-0">
                    <span className="text-base">{entry.store?.name}</span>
                    <span className="text-xs text-text-muted">
                      {entry.store?.district} · Beirut
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-border-soft/60 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold text-text-muted mb-2">Price</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-text-main font-data leading-none">
                        {entry.priceLbp.toLocaleString()}
                      </span>
                      <span className="text-lg font-bold text-text-muted">LBP</span>
                    </div>
                    <p className="text-xl font-semibold text-text-muted mt-2">≈ ${usdPrice}</p>
                  </div>

                  <div className="text-sm text-text-muted">
                    Updated {timeAgo(entry.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="card p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-text-main">Price history</h2>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                Stable
              </div>
            </div>

            <div className="h-[220px]">
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

        <aside className="w-full lg:w-[360px] flex flex-col gap-6">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-text-main mb-6">Price details</h2>

            <div className="grid grid-cols-1 gap-3 mb-8">
              <div className="p-5 bg-bg-muted rounded-2xl border border-border-soft">
                <p className="text-xs font-semibold text-text-muted mb-1">Community confirmations</p>
                <p className="text-2xl font-bold text-text-main">{entry.upvotes ?? 0}</p>
              </div>

              <div className="p-5 bg-bg-muted rounded-2xl border border-border-soft">
                <p className="text-xs font-semibold text-text-muted mb-1">Trust level</p>
                <p className="text-2xl font-bold text-green-600">High</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full h-14 rounded-full bg-text-main text-white font-semibold text-lg hover:opacity-95 transition-all"
              >
                Add to cart
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button className="w-full h-12 rounded-full border border-border-soft text-text-main font-semibold hover:bg-bg-muted transition-all">
                  Verify
                </button>
                <button className="w-full h-12 rounded-full border border-border-soft text-text-main font-semibold hover:bg-bg-muted transition-all">
                  Report
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold text-text-muted">Notes and reports</p>

            {feedbacks.length > 0 ? (
              feedbacks.map((feedback, index) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <FeedbackCard feedback={feedback} />
                </motion.div>
              ))
            ) : (
              <div className="py-16 flex flex-col items-center text-center bg-bg-muted/30 rounded-[2rem] border border-dashed border-border-soft">
                <span className="material-symbols-outlined text-4xl mb-3 text-text-muted/40">
                  chat
                </span>
                <p className="text-sm font-medium text-text-muted">
                  No notes or reports yet.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}