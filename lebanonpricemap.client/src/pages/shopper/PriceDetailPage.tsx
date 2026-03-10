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

  const entry = getEnrichedPriceEntries().find((e) => e.id === id);
  const feedbacks = getEnrichedFeedback().filter((f) => f.priceEntryId === id);

  if (!entry) return <NotFoundPage />;

  const usdPrice = (entry.priceLbp / rateLbpPerUsd).toFixed(2);

  const handleAddToCart = () => {
    addItem(entry.productId);
    addToast(`${entry.product?.name ?? 'Item'} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-5 py-12 md:py-20 animate-page">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* Main content */}
        <div className="flex-1 flex flex-col gap-7">
          {/* Top nav */}
          <header className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-bg-muted text-text-muted hover:text-text-main flex items-center justify-center transition-all border border-border-soft"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs font-semibold text-text-muted">Verified price</p>
            </div>
          </header>

          {/* Product card */}
          <section className="card p-7 md:p-9">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-36 h-36 md:w-44 md:h-44 bg-bg-muted rounded-2xl flex items-center justify-center shrink-0 border border-border-soft">
                <span className="material-symbols-outlined text-5xl text-text-muted/20">
                  inventory_2
                </span>
              </div>

              <div className="flex-1 flex flex-col">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <div className="px-3 py-1 bg-text-main text-white text-[10px] font-bold rounded-full">
                    {entry.product?.category}
                  </div>
                  <StatusBadge status={entry.status} />
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-text-main tracking-tight mb-1.5">
                  {entry.product?.name}
                </h1>
                <p className="text-sm text-text-muted mb-5">{entry.product?.unit}</p>

                {/* Store chip */}
                <div className="flex items-center gap-3 text-text-main font-semibold mb-auto p-3.5 bg-bg-muted/50 rounded-xl border border-border-soft w-fit">
                  <span className="material-symbols-outlined text-lg opacity-40">storefront</span>
                  <div>
                    <p className="text-sm font-semibold">{entry.store?.name}</p>
                    <p className="text-xs text-text-muted">{entry.store?.district} · Beirut</p>
                  </div>
                </div>

                {/* Price row */}
                <div className="mt-6 pt-6 border-t border-border-soft/60 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-text-muted mb-1.5">Current price</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-bold text-text-main font-data leading-none">
                        {entry.priceLbp.toLocaleString()}
                      </span>
                      <span className="text-base font-bold text-text-muted">LBP</span>
                    </div>
                    <p className="text-base font-semibold text-text-muted mt-1">≈ ${usdPrice}</p>
                  </div>

                  <p className="text-sm text-text-muted">
                    Updated {timeAgo(entry.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Price history */}
          <section className="card p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-main">Price history</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
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

        {/* Sidebar */}
        <aside className="w-full lg:w-[340px] flex flex-col gap-5">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-text-main mb-5">Price details</h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 bg-bg-muted rounded-xl border border-border-soft">
                <p className="text-[10px] font-semibold text-text-muted mb-1">Confirmations</p>
                <p className="text-xl font-bold text-text-main">{entry.upvotes ?? 0}</p>
              </div>
              <div className="p-4 bg-bg-muted rounded-xl border border-border-soft">
                <p className="text-[10px] font-semibold text-text-muted mb-1">Trust level</p>
                <p className="text-xl font-bold text-green-600">High</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={handleAddToCart}
                className="w-full h-12 rounded-xl bg-text-main text-white font-semibold hover:opacity-95 transition-all"
              >
                Add to cart
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button className="w-full h-11 rounded-xl border border-border-soft text-text-main text-sm font-semibold hover:bg-bg-muted transition-all">
                  Verify
                </button>
                <button className="w-full h-11 rounded-xl border border-border-soft text-text-main text-sm font-semibold hover:bg-bg-muted transition-all">
                  Report
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-text-muted px-1">Notes & reports</p>

            {feedbacks.length > 0 ? (
              feedbacks.map((feedback, index) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                >
                  <FeedbackCard feedback={feedback} />
                </motion.div>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center text-center bg-bg-muted/30 rounded-2xl border border-dashed border-border-soft">
                <span className="material-symbols-outlined text-3xl mb-2.5 text-text-muted/30">chat</span>
                <p className="text-sm font-medium text-text-muted">No notes or reports yet.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}