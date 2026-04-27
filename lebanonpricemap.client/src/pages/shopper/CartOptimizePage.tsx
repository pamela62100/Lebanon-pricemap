import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import type { StoreBasketCost } from '@/store/useCartStore';

function StoreCard({ store, isFeatured, featuredLabel }: { store: StoreBasketCost; isFeatured: boolean; featuredLabel?: string }) {
  const [expanded, setExpanded] = useState(isFeatured);
  const { rateLbpPerUsd } = useExchangeRateStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border transition-all overflow-hidden',
        isFeatured
          ? 'border-primary/30 bg-primary/[0.03]'
          : store.isComplete
          ? 'border-green-200 bg-green-50/40'
          : 'border-border-soft bg-white'
      )}
    >
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-bg-base/40 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-text-main">{store.storeName}</p>
              {isFeatured && featuredLabel && (
                <span className="px-2 py-0.5 bg-primary text-white rounded-full text-[10px] font-semibold">{featuredLabel}</span>
              )}
              {store.isComplete ? (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-semibold">Complete list</span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-semibold">
                  {store.missingItems.length} missing
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              {store.foundCount} of {store.totalCount} items
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-lg font-bold text-text-main font-data leading-none">
              {store.totalLbp.toLocaleString()} <span className="text-xs font-semibold text-text-muted">LBP</span>
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">≈ ${(store.totalLbp / rateLbpPerUsd).toFixed(2)}</p>
          </div>
          <span className="material-symbols-outlined text-[20px] text-text-muted">
            {expanded ? 'expand_less' : 'expand_more'}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-0 border-t border-border-soft/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-[11px] font-semibold text-green-700 uppercase tracking-wide mb-2">
                Found ({store.foundItems.length})
              </p>
              {store.foundItems.length === 0 ? (
                <p className="text-xs text-text-muted">No items found here.</p>
              ) : (
                <ul className="space-y-1.5">
                  {store.foundItems.map(item => (
                    <li key={item.productId} className="flex items-center justify-between text-sm gap-2">
                      <span className="text-text-main truncate">
                        {item.productName}
                        {item.quantity > 1 && <span className="text-text-muted"> ×{item.quantity}</span>}
                      </span>
                      {item.unitPriceLbp != null && (
                        <span className="text-text-muted text-xs font-data shrink-0">
                          {(item.unitPriceLbp * item.quantity).toLocaleString()} LBP
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide mb-2">
                Missing ({store.missingItems.length})
              </p>
              {store.missingItems.length === 0 ? (
                <p className="text-xs text-green-700">Has every item on your list ✓</p>
              ) : (
                <ul className="space-y-1.5">
                  {store.missingItems.map(item => (
                    <li key={item.productId} className="text-sm text-text-muted line-through">
                      {item.productName}
                      {item.quantity > 1 && <span> ×{item.quantity}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function CartOptimizePage() {
  const navigate = useNavigate();
  const { items, isLoading, optimization, fetchCart, optimizeCart } = useCartStore();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    fetchCart().then(() => {
      const freshItems = useCartStore.getState().items;
      if (freshItems.length > 0) optimizeCart();
    }).finally(() => setHasFetched(true));
  }, []);

  if (!hasFetched || isLoading) {
    return (
      <div className="px-6 lg:px-8 py-8 animate-page space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-bg-muted/40 animate-pulse" />
        ))}
      </div>
    );
  }

  const stores = optimization?.stores ?? [];
  const bestComplete = stores.find(s => s.storeId === optimization?.bestCompleteStoreId);
  const cheapestPartial = stores.find(s => s.storeId === optimization?.cheapestPartialStoreId);
  const noStoreHasAll = !bestComplete && stores.length > 0;

  return (
    <div className="px-6 lg:px-8 py-8 animate-page max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/app/list')}
        className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-main mb-6 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to list
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-main mb-1">Store finder</h1>
        <p className="text-sm text-text-muted">
          {items.length > 0
            ? `Comparing ${items.length} item${items.length !== 1 ? 's' : ''} across ${stores.length} store${stores.length !== 1 ? 's' : ''}`
            : 'Add items to your list to compare stores'}
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState icon="storefront" title="Your list is empty" subtitle="Add products to your list to compare stores." />
      ) : !optimization || stores.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <span className="material-symbols-outlined text-4xl text-text-muted/30">storefront</span>
          <p className="text-sm text-text-muted">No store carries items from your list yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Headline cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bestComplete ? (
              <div className="p-5 rounded-xl bg-green-500 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">Best complete store</p>
                <p className="text-xl font-bold mt-1">{bestComplete.storeName}</p>
                <p className="text-3xl font-bold font-data mt-2">
                  {bestComplete.totalLbp.toLocaleString()}
                  <span className="text-sm font-semibold ml-1 opacity-70">LBP</span>
                </p>
                <p className="text-xs text-white/70 mt-1">All {bestComplete.totalCount} items in stock</p>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">No complete option</p>
                <p className="text-base font-semibold text-text-main mt-1">No store has all your items</p>
                <p className="text-xs text-amber-700 mt-1">You may need to split your shopping across stores.</p>
              </div>
            )}

            {cheapestPartial && (!bestComplete || cheapestPartial.storeId !== bestComplete.storeId) && (
              <div className="p-5 rounded-xl bg-text-main text-white">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-white/60">Lowest partial total</p>
                <p className="text-xl font-bold mt-1">{cheapestPartial.storeName}</p>
                <p className="text-3xl font-bold font-data mt-2">
                  {cheapestPartial.totalLbp.toLocaleString()}
                  <span className="text-sm font-semibold ml-1 opacity-60">LBP</span>
                </p>
                <p className="text-xs text-white/60 mt-1">
                  Only {cheapestPartial.foundCount} of {cheapestPartial.totalCount} items
                </p>
              </div>
            )}
          </div>

          {noStoreHasAll && (
            <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-600 text-[18px] mt-0.5">info</span>
              <div className="text-sm">
                <p className="font-semibold text-amber-800">No store has every item on your list</p>
                <p className="text-amber-700 text-xs mt-0.5">Click any store below to see exactly what they're missing.</p>
              </div>
            </div>
          )}

          {/* Detailed store list */}
          <div>
            <p className="text-sm font-semibold text-text-main mb-3">All stores ({stores.length})</p>
            <div className="space-y-3">
              {stores.map((store) => (
                <StoreCard
                  key={store.storeId}
                  store={store}
                  isFeatured={store.storeId === bestComplete?.storeId || (!bestComplete && store.storeId === cheapestPartial?.storeId)}
                  featuredLabel={
                    bestComplete && store.storeId === bestComplete.storeId
                      ? 'Best complete'
                      : !bestComplete && store.storeId === cheapestPartial?.storeId
                      ? 'Lowest partial'
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
