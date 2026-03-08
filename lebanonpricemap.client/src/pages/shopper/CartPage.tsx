import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useCartStore,
  calculateStoreComparisons,
  getSplitTripSuggestion
} from '@/store/useCartStore';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';
import { getEnrichedPriceEntries, MOCK_STORES } from '@/api/mockData';
import { formatLBP } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { useRouteDialog } from '@/hooks/useRouteDialog';

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getEnrichedItems } = useCartStore();
  const { rateLbpPerUsd } = useExchangeRateStore();
  const { open, getParam } = useRouteDialog();
  const enrichedItems = getEnrichedItems();
  const allPrices = useMemo(() => getEnrichedPriceEntries(), []);

  // useMemo — heavy math only reruns when cart or prices change, not on every render
  const comparisons = useMemo(
    () => calculateStoreComparisons(items, allPrices, MOCK_STORES, rateLbpPerUsd),
    [items, allPrices, rateLbpPerUsd]
  );

  const splitSuggestion = useMemo(
    () => getSplitTripSuggestion(comparisons, allPrices),
    [comparisons, allPrices]
  );

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-96px)]">
        <EmptyState
          icon="shopping_cart"
          title="Your cart is empty"
          subtitle="Search for products and tap the cart icon to add them."
        />
      </div>
    );
  }

  return (
    <>
    <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* ── LEFT: Cart Items ── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text-main">
            Shopping List
            <span className="ml-2 text-sm font-normal bg-primary text-white px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </h1>
          <button
            onClick={() => open('clear-cart')}
            className="text-sm text-text-muted hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        </div>

        <AnimatePresence>
          {enrichedItems.map(item => (
            <motion.div
              key={item.productId}
              layout
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              className="flex items-center gap-4 p-4 bg-bg-surface border border-border-soft rounded-xl mb-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold text-text-main text-sm truncate">
                  {item.product?.name ?? item.productId}
                </p>
                <p className="text-xs text-text-muted">{item.product?.nameAr}</p>
              </div>

              {/* Quantity stepper */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-border-soft flex items-center justify-center hover:bg-bg-muted transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>remove</span>
                </button>
                <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-border-soft flex items-center justify-center hover:bg-bg-muted transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                </button>
              </div>

              <button
                onClick={() => open('remove-item', { id: item.productId })}
                className="text-text-muted hover:text-red-500 transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── RIGHT: Store Comparison ── */}
      <div>
        <h2 className="text-2xl font-bold text-text-main mb-6">Best Stores For Your List</h2>

        {splitSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-xl border border-primary bg-primary/5"
          >
            <p className="text-sm font-semibold text-primary">{splitSuggestion}</p>
          </motion.div>
        )}

        <div className="flex flex-col gap-3">
          {comparisons.map((comp, idx) => (
            <motion.div
              key={comp.store.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className={`p-5 rounded-xl border ${
                idx === 0
                  ? 'border-green-500/40 bg-green-500/5'
                  : 'border-border-soft bg-bg-surface'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-text-main">{comp.store.name}</span>
                    {idx === 0 && (
                      <span className="text-[10px] font-bold bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full uppercase">
                        Best Value
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    {comp.store.district} · {comp.itemsFound}/{comp.itemsTotal} items
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-lg font-bold text-text-main">{formatLBP(comp.totalLbp)}</p>
                  <p className="text-xs text-text-muted">≈ ${comp.totalUsd.toFixed(2)}</p>
                </div>
              </div>

              {/* Coverage bar */}
              <div className="h-1.5 bg-bg-muted rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${comp.coverage * 100}%` }}
                />
              </div>

              {comp.missingItems.length > 0 && (
                <p className="text-[11px] text-text-muted">
                  Not available: {comp.missingItems.join(', ')}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>

      {/* ── URL-Driven Confirm Dialogs ─────────────────── */}
      <ConfirmDialog
        dialogId="clear-cart"
        title="Clear Shopping List"
        description={`Remove all ${items.length} items from your shopping list?`}
        confirmLabel="Clear All"
        variant="warning"
        onConfirm={clearCart}
      />
      <ConfirmDialog
        dialogId="remove-item"
        title="Remove Item"
        description="Remove this product from your shopping list?"
        confirmLabel="Remove"
        variant="danger"
        onConfirm={() => {
          const id = getParam('id');
          if (id) removeItem(id);
        }}
      />
    </>
  );
}
