import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { useNavigate } from 'react-router-dom';

export function CartPage() {
  const { items, isLoading, optimization, fetchCart, removeItem, updateQuantity, clearCart, optimizeCart } = useCartStore();
  const { rateLbpPerUsd } = useExchangeRateStore();
  const { open, getParam } = useRouteDialog();
  const navigate = useNavigate();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    fetchCart().finally(() => setHasFetched(true));
  }, []);

  if (!hasFetched || isLoading) {
    return (
      <div className="px-6 lg:px-8 py-8 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="card p-6 h-24 animate-pulse bg-bg-muted/40" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState
          icon="checklist"
          title="Your list is empty"
          subtitle="Add products from search results or the map to compare prices across stores."
        />
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-8 py-8 animate-page">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <header>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-text-main">My List</h1>
                <p className="text-sm text-text-muted mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => navigate('/app/list/optimize')}
                className="btn-primary h-10 px-5 rounded-xl text-sm"
              >
                <span className="material-symbols-outlined text-lg">storefront</span>
                Find Best Store
              </button>

              <button
                onClick={() => open('clear-cart')}
                className="px-5 h-10 rounded-xl bg-bg-muted text-text-muted hover:text-text-main font-semibold transition-all text-sm border border-border-soft"
              >
                Clear list
              </button>
            </div>
          </header>

          <section className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="card p-5 flex items-center gap-5 group"
              >
                  <div className="w-12 h-12 rounded-xl bg-bg-muted flex items-center justify-center text-text-muted shrink-0">
                    <span className="material-symbols-outlined text-xl">inventory_2</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-text-main truncate">
                      {item.productName}
                    </h3>
                    {item.storeName && (
                      <p className="text-xs text-text-muted mt-0.5">{item.storeName}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 bg-bg-muted p-1 rounded-xl">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-9 h-9 rounded-lg bg-white border border-border-soft flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">remove</span>
                    </button>

                    <span className="w-10 text-center font-bold text-text-main text-sm">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-9 h-9 rounded-lg bg-white border border-border-soft flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">add</span>
                    </button>
                  </div>

                  <button
                    onClick={() => open('remove-item', { id: item.id })}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-500/5 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
              </div>
            ))}
          </section>
        </div>

        <aside className="lg:col-span-5 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-text-main">Store Comparison</h2>
            <p className="text-sm text-text-muted mt-0.5">See which store gives you the best total</p>
          </div>

          {!optimization ? (
            <div className="p-6 rounded-2xl border border-dashed border-border-soft flex flex-col items-center text-center gap-4">
              <span className="material-symbols-outlined text-4xl text-text-muted/30">storefront</span>
              <p className="text-sm text-text-muted">
                Click "Find Best Store" to compare store totals across your list.
              </p>
              <button
                onClick={optimizeCart}
                className="btn-primary h-10 px-5 rounded-xl text-sm"
              >
                Compare stores
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {optimization.recommendedStoreName && (
                <div className="p-5 rounded-2xl bg-text-main text-white shadow-xl shadow-text-main/10">
                  <p className="text-xs font-medium text-white/60 mb-1">Best pick</p>
                  <p className="text-base font-bold">{optimization.recommendedStoreName}</p>
                  <p className="text-2xl font-bold font-data mt-1">
                    {optimization.recommendedTotalLbp.toLocaleString()}
                    <span className="text-xs font-semibold ml-1 opacity-60">LBP</span>
                  </p>
                  <p className="text-xs mt-0.5 text-white/50">
                    ≈ ${(optimization.recommendedTotalLbp / rateLbpPerUsd).toFixed(2)}
                  </p>
                </div>
              )}

              {optimization.stores.slice(0, 4).map((store, index) => (
                <motion.div
                  key={store.storeId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'p-5 rounded-2xl border transition-all',
                    index === 0
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-white border-border-soft'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-text-main">{store.storeName}</h4>
                        {index === 0 && (
                          <span className="px-2 py-0.5 bg-green-500 text-white rounded text-[10px] font-bold">
                            Best
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted">
                        {store.itemsCovered} found · {store.itemsMissing} missing
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-text-main font-data leading-none">
                        {store.totalLbp.toLocaleString()}
                      </p>
                      <p className="text-xs text-text-muted">LBP</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <button
                onClick={() => navigate('/app/list/optimize')}
                className="w-full h-10 rounded-xl border border-border-soft text-sm font-semibold text-text-muted hover:text-text-main hover:border-text-main/20 transition-all"
              >
                View full comparison
              </button>
            </div>
          )}
        </aside>
      </div>

      <ConfirmDialog
        dialogId="clear-cart"
        title="Clear list"
        description={`Remove all ${items.length} items from your list?`}
        confirmLabel="Clear list"
        variant="warning"
        onConfirm={clearCart}
      />

      <ConfirmDialog
        dialogId="remove-item"
        title="Remove item"
        description="Remove this item from your list?"
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
