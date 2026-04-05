import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';

export function CartOptimizePage() {
  const navigate = useNavigate();
  const { items, isLoading, optimization, fetchCart, optimizeCart } = useCartStore();
  const [hasFetched, setHasFetched] = useState(false);

  // Bug fix: use getState() to read fresh items after fetch, not stale closure
  useEffect(() => {
    fetchCart().then(() => {
      const freshItems = useCartStore.getState().items;
      if (freshItems.length > 0) optimizeCart();
    }).finally(() => setHasFetched(true));
  }, []);

  const bestStore = optimization?.stores?.[0] ?? null;
  const allStores = optimization?.stores ?? [];

  if (!hasFetched || isLoading) {
    return (
      <div className="px-6 lg:px-8 py-8 animate-page">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 h-24 animate-pulse bg-bg-muted/40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-8 py-8 animate-page">
      {/* Back button */}
      <button
        onClick={() => navigate('/app/list')}
        className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-main mb-6 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to list
      </button>

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main mb-1">Store Finder</h1>
        <p className="text-sm text-text-muted">
          {items.length > 0
            ? `Comparing ${items.length} item${items.length !== 1 ? 's' : ''} across ${allStores.length} store${allStores.length !== 1 ? 's' : ''}`
            : 'Add items to your list to compare stores'}
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="storefront"
          title="Your list is empty"
          subtitle="Add products to your list to compare stores and find the lowest total."
        />
      ) : !optimization ? (
        <div className="flex flex-col items-center gap-4 py-20">
          <span className="material-symbols-outlined text-5xl text-text-muted/30 animate-pulse">storefront</span>
          <p className="text-sm font-medium text-text-muted">Analyzing store prices...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Best store banner */}
          {bestStore && (
            <div className="p-6 rounded-2xl bg-green-500 text-white flex items-center gap-5 shadow-lg shadow-green-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <span className="material-symbols-outlined text-8xl">verified</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">check_circle</span>
              </div>
              <div>
                <p className="text-xs font-medium text-white/70 mb-0.5">Best store for your list</p>
                <h2 className="text-lg font-bold">
                  {optimization.recommendedStoreName ?? bestStore.storeName}
                </h2>
                <p className="text-sm text-white/80 mt-0.5">
                  Total:{' '}
                  <span className="text-white font-bold">
                    {(optimization.recommendedTotalLbp ?? bestStore.totalLbp).toLocaleString()} LBP
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Store comparison table */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-border-soft flex items-center justify-between">
              <h2 className="text-base font-semibold text-text-main">All stores</h2>
              <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Live data
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-border-soft bg-bg-muted/30">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted">Store</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-text-muted">Coverage</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-text-muted">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft/40">
                {allStores
                  .sort((a, b) => a.totalLbp - b.totalLbp)
                  .map((store, index) => (
                    <tr key={store.storeId} className="hover:bg-bg-muted/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold',
                              index === 0 ? 'bg-primary text-white' : 'bg-bg-muted text-text-muted'
                            )}
                          >
                            {index + 1}
                          </div>
                          <span className="font-medium text-text-main">{store.storeName}</span>
                          {index === 0 && (
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-600 rounded text-[10px] font-semibold">
                              Best
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={cn(
                            'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                            store.itemsMissing === 0
                              ? 'bg-green-500/10 text-green-600'
                              : 'bg-amber-500/10 text-amber-600'
                          )}
                        >
                          {store.itemsCovered} / {store.itemsCovered + store.itemsMissing} items
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={cn(
                            'text-base font-bold font-data',
                            index === 0 ? 'text-text-main' : 'text-text-muted'
                          )}
                        >
                          {store.totalLbp.toLocaleString()} LBP
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
