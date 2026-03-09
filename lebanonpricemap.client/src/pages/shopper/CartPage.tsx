import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useCartStore,
  calculateStoreComparisons,
  getSplitTripSuggestion
} from '@/store/useCartStore';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';
import { getEnrichedPriceEntries, MOCK_STORES } from '@/api/mockData';
import { formatLBP, cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { useNavigate } from 'react-router-dom';

export function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getEnrichedItems } = useCartStore();
  const { rateLbpPerUsd } = useExchangeRateStore();
  const { open, getParam } = useRouteDialog();
  const navigate = useNavigate();
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState
          icon="shopping_cart"
          title="Cart is empty"
          subtitle="Add tactical entries from the market pulse to begin optimization."
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-12 md:py-20 animate-page">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Shopping List Segment */}
        <div className="lg:col-span-7 space-y-10">
          <header>
            <div className="flex items-center justify-between mb-8">
               <div>
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] mb-3">Provisioning_Protocol</p>
                  <h1 className="text-3xl md:text-4xl font-bold text-text-main tracking-tighter">My Cart.</h1>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-2xl font-bold text-text-main font-data">{items.length}</span>
                  <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest leading-none">Units_Active</span>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <button
                  onClick={() => navigate('/app/cart/optimize', { state: { cartItems: items } })}
                  className="btn-primary h-12 px-6 rounded-xl shadow-lg shadow-text-main/5 text-xs"
                >
                  <span className="material-symbols-outlined text-lg">analytics</span>
                  Run Optimizer
                </button>
                <button
                  onClick={() => open('clear-cart')}
                  className="px-5 h-12 rounded-xl bg-bg-muted text-text-muted hover:text-text-main font-bold transition-all text-[9px] uppercase tracking-widest border border-border-soft"
                >
                  Clear All
                </button>
            </div>
          </header>

          <section className="space-y-4">
            <AnimatePresence mode="popLayout">
              {enrichedItems.map(item => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="card p-6 flex items-center gap-6 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-bg-muted flex items-center justify-center text-text-muted shrink-0 group-hover:bg-bg-base transition-colors">
                     <span className="material-symbols-outlined text-2xl">inventory_2</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-text-main truncate mb-1">
                      {item.product?.name ?? item.productId}
                    </h3>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">
                      {item.product?.unit} // {item.product?.category}
                    </p>
                  </div>

                  {/* V3 Stepper */}
                  <div className="flex items-center gap-1 bg-bg-muted p-1 rounded-xl">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-10 h-10 rounded-lg bg-white border border-border-soft flex items-center justify-center hover:bg-text-main hover:text-white transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined text-lg">remove</span>
                    </button>
                    <span className="w-12 text-center font-bold text-text-main font-data">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-10 h-10 rounded-lg bg-white border border-border-soft flex items-center justify-center hover:bg-text-main hover:text-white transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>

                  <button
                    onClick={() => open('remove-item', { id: item.productId })}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-500/5 transition-all"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </section>
        </div>

        {/* Store Comparison Sidebar */}
        <aside className="lg:col-span-5 space-y-10">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">Market_Simulation</p>
            <h2 className="text-3xl font-bold text-text-main tracking-tight">Intelligence Feed</h2>
          </div>

          {splitSuggestion && (
            <div className="p-6 rounded-2xl bg-text-main text-white shadow-xl shadow-text-main/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-6xl">insights</span>
               </div>
               <p className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-60">Strategic_Advise</p>
               <p className="text-sm font-bold leading-relaxed">{splitSuggestion}</p>
            </div>
          )}

          <div className="space-y-4">
            {comparisons.slice(0, 4).map((comp, idx) => (
              <motion.div
                key={comp.store.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "p-6 rounded-2xl border transition-all",
                  idx === 0
                    ? "bg-green-500/10 border-green-500/20 shadow-lg shadow-green-500/5"
                    : "bg-white border-border-soft"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <h4 className="font-bold text-text-main">{comp.store.name}</h4>
                       {idx === 0 && (
                         <span className="px-2 py-0.5 bg-green-500 text-white rounded text-[8px] font-bold uppercase tracking-widest">Optimal</span>
                       )}
                    </div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                       {comp.store.district} // {comp.itemsFound} found
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-text-main font-data leading-none mb-1">
                       {comp.totalLbp.toLocaleString()}
                    </p>
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">LBP_EST</p>
                  </div>
                </div>

                <div className="h-1 bg-bg-muted rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${comp.coverage * 100}%` }}
                    className={cn(
                      "h-full rounded-full",
                      idx === 0 ? "bg-green-500" : "bg-text-main"
                    )}
                  />
                </div>

                {comp.missingItems.length > 0 && (
                  <p className="text-[9px] font-bold text-text-muted/60 uppercase tracking-widest truncate">
                    Missing: {comp.missingItems.join(', ')}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </aside>
      </div>

      <ConfirmDialog
        dialogId="clear-cart"
        title="Wipe Protocol Active"
        description={`Emergency reset: Remove all ${items.length} units from the shopping list?`}
        confirmLabel="Confirm Wipe"
        variant="warning"
        onConfirm={clearCart}
      />
      <ConfirmDialog
        dialogId="remove-item"
        title="Asset Removal"
        description="Decommission this item from the active cart?"
        confirmLabel="Remove"
        variant="danger"
        onConfirm={() => {
          const id = getParam('id');
          if (id) removeItem(id);
        }}
      />
    </div>
  );
}
