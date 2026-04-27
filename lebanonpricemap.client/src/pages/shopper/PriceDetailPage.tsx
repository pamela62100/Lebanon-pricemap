import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pricesApi } from '@/api/prices.api';
import { feedbackApi } from '@/api/feedback.api';
import { timeAgo } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriceHistoryChart } from '@/components/charts/PriceHistoryChart';
import { ReportPriceDialog } from '@/components/dialogs/ReportPriceDialog';
import { NotFoundPage } from '@/pages/shared/NotFoundPage';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';
import type { PriceEntry, FeedbackType } from '@/types';

export function PriceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);
  const { rateLbpPerUsd } = useExchangeRateStore();

  const [entry, setEntry] = useState<PriceEntry | null>(null);
  const [history, setHistory] = useState<{ date: string; price: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [voting, setVoting] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    pricesApi.getById(id)
      .then(res => {
        const data = (res as any).data?.data;
        if (data) {
          setEntry(data);
          // Fetch history after we have the productId
          pricesApi.getHistory(data.productId)
            .then(hr => {
              const pts = (hr as any).data?.data ?? [];
              setHistory(Array.isArray(pts) ? pts.map((p: any) => ({ date: p.date, price: Number(p.price) })) : []);
            })
            .catch(() => {});
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="material-symbols-outlined animate-spin text-4xl text-text-muted">progress_activity</span>
    </div>
  );

  if (notFound || !entry) return <NotFoundPage />;

  const usdPrice = (entry.priceLbp / rateLbpPerUsd).toFixed(2);

  const handleAddToCart = () => {
    addItem(entry.productId);
    addToast(`${entry.product?.name ?? 'Item'} added to list`);
  };

  const handleVote = async (value: 1 | -1) => {
    if (voting) return;
    setVoting(true);
    try {
      await pricesApi.vote(entry.id, value);
      addToast(value === 1 ? 'Price confirmed — thanks!' : 'Report submitted', value === 1 ? 'success' : 'info');
      // Optimistically update upvotes display
      setEntry(prev => prev ? { ...prev, upvotes: (prev.upvotes ?? 0) + (value === 1 ? 1 : 0) } : prev);
    } catch {
      addToast('Could not record vote', 'error');
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="px-6 lg:px-8 py-8 animate-page">
      {/* Back nav */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-main mb-6 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to search
      </button>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Main content */}
        <div className="flex-1 flex flex-col gap-5">
          <section className="card p-6">
            <div className="flex items-start gap-4 mb-5">
              {/* Category + status badges */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {entry.product?.category && (
                    <span className="px-2.5 py-0.5 bg-bg-muted text-text-muted text-xs font-medium rounded-full border border-border-soft">
                      {entry.product.category}
                    </span>
                  )}
                  <StatusBadge status={entry.status} />
                </div>
                <h1 className="text-xl font-bold text-text-main mb-0.5">
                  {entry.product?.name}
                </h1>
                <p className="text-sm text-text-muted">{entry.product?.unit}</p>
              </div>
            </div>

            {/* Store */}
            <div className="flex items-center gap-3 p-3 bg-bg-muted/50 rounded-xl border border-border-soft mb-5 w-fit">
              <span className="material-symbols-outlined text-base text-text-muted">storefront</span>
              <div>
                <p className="text-sm font-semibold text-text-main">{entry.store?.name}</p>
                <p className="text-xs text-text-muted">{entry.store?.city}</p>
              </div>
            </div>

            {/* Price */}
            <div className="pt-4 border-t border-border-soft/60 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-text-muted mb-1">Current price</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-text-main font-data leading-none">
                    {entry.priceLbp.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-text-muted">LBP</span>
                </div>
                <p className="text-sm text-text-muted mt-0.5">≈ ${usdPrice}</p>
              </div>
              <p className="text-xs text-text-muted">Updated {timeAgo(entry.createdAt)}</p>
            </div>
          </section>

          <section className="card p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-main">Price history</h2>
              {history.length > 0 && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  {history.length} submissions
                </span>
              )}
            </div>
            {history.length > 0 ? (
              <div className="h-[200px]">
                <PriceHistoryChart data={history} />
              </div>
            ) : (
              <div className="h-[200px] flex flex-col items-center justify-center text-center gap-2">
                <span className="material-symbols-outlined text-3xl text-text-muted/30">show_chart</span>
                <p className="text-sm text-text-muted">Not enough data yet for a price history chart.</p>
              </div>
            )}
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
                className="w-full h-12 rounded-xl bg-primary text-white font-semibold hover:opacity-95 transition-all"
              >
                Add to list
              </button>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleVote(1)}
                  disabled={voting}
                  className="w-full h-11 rounded-xl border border-border-soft text-text-main text-sm font-semibold hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {voting ? (
                    <>
                      <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Verify
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowReport(true)}
                  className="w-full h-11 rounded-xl border border-border-soft text-text-main text-sm font-semibold hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">flag</span>
                  Report
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-text-muted px-1">Notes & reports</p>
            <div className="py-12 flex flex-col items-center text-center bg-bg-muted/30 rounded-2xl border border-dashed border-border-soft">
              <span className="material-symbols-outlined text-3xl mb-2.5 text-text-muted/30">chat</span>
              <p className="text-sm font-medium text-text-muted">No notes or reports yet.</p>
            </div>
          </div>
        </aside>
      </div>

      <ReportPriceDialog
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        currentPrice={entry.priceLbp}
        onSubmit={async (type: FeedbackType, note: string) => {
          try {
            await feedbackApi.submit({ priceEntryId: entry.id, type, note });
            addToast('Report submitted — thanks!', 'info');
          } catch {
            addToast('Could not submit report', 'error');
          }
        }}
      />
    </div>
  );
}
