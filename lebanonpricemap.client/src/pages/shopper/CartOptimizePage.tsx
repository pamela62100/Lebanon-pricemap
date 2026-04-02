import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';

export function CartOptimizePage() {
  const navigate = useNavigate();
  const { items, isLoading, optimization, fetchCart, optimizeCart } = useCartStore();

  useEffect(() => {
    fetchCart().then(() => {
      if (items.length > 0) optimizeCart();
    });
  }, []);

  const bestStore = optimization?.stores?.[0] ?? null;
  const allStores = optimization?.stores ?? [];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-12 md:py-20 animate-page">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 h-24 animate-pulse bg-bg-muted/40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-12 md:py-20 animate-page">
      <div className="flex flex-col gap-12">
        <header className="space-y-8">
          <button
            onClick={() => navigate('/app/cart')}
            className="flex items-center gap-2 text-[10px] font-bold text-text-muted hover:text-text-main uppercase tracking-[0.2em] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to cart
          </button>

          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">
              Cart optimizer
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-text-main tracking-tighter leading-none">
              Smart shopping
              <br />
              plan.
            </h1>

            <div className="flex items-center gap-4 mt-8 flex-wrap">
              <div className="px-3 py-1 bg-text-main text-white rounded-full text-[9px] font-bold uppercase tracking-widest">
                {items.length} items analyzed
              </div>
              <div className="px-3 py-1 bg-bg-muted text-text-muted rounded-full text-[9px] font-bold uppercase tracking-widest">
                {allStores.length} stores compared
              </div>
            </div>
          </div>
        </header>

        {items.length === 0 ? (
          <EmptyState
            icon="analytics"
            title="Your cart is empty"
            subtitle="Add products to your cart to compare stores and find the lowest total."
          />
        ) : !optimization ? (
          <div className="flex flex-col items-center gap-6 py-20">
            <span className="material-symbols-outlined text-5xl text-text-muted/30 animate-pulse">analytics</span>
            <p className="text-sm font-semibold text-text-muted">Analyzing store prices...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {bestStore && (
              <div className="p-8 rounded-[2rem] bg-green-500 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-green-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <span className="material-symbols-outlined text-8xl">verified</span>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Best store: {optimization.recommendedStoreName ?? bestStore.storeName}
                  </h2>
                  <p className="text-sm text-white/60 mt-1 font-medium leading-relaxed">
                    Total:{' '}
                    <span className="text-white font-bold">
                      {(optimization.recommendedTotalLbp ?? bestStore.totalLbp).toLocaleString()} LBP
                    </span>
                  </p>
                </div>
              </div>
            )}

            <section className="card overflow-hidden">
              <div className="p-8 border-b border-border-soft flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-text-main tracking-tight">All store comparisons</h2>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1 opacity-60">
                    Full price comparison
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[9px] font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Live data
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-bg-muted/30">
                      <th className="px-8 py-5 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Store
                      </th>
                      <th className="px-8 py-5 text-center text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Coverage
                      </th>
                      <th className="px-8 py-5 text-right text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border-soft/40">
                    {allStores
                      .sort((a, b) => a.totalLbp - b.totalLbp)
                      .map((store, index) => (
                        <tr key={store.storeId} className="group hover:bg-bg-muted/10 transition-colors">
                          <td className="px-8 py-8">
                            <div className="flex items-center gap-6">
                              <div
                                className={cn(
                                  'w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold font-data',
                                  index === 0 ? 'bg-text-main text-white' : 'bg-bg-muted text-text-muted'
                                )}
                              >
                                {String(index + 1).padStart(2, '0')}
                              </div>
                              <p className="font-bold text-text-main">{store.storeName}</p>
                            </div>
                          </td>

                          <td className="px-8 py-8 text-center">
                            <div
                              className={cn(
                                'inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest',
                                store.itemsMissing === 0
                                  ? 'bg-green-500/10 text-green-600'
                                  : 'bg-amber-500/10 text-amber-600'
                              )}
                            >
                              {store.itemsCovered} / {store.itemsCovered + store.itemsMissing} items
                            </div>
                          </td>

                          <td className="px-8 py-8 text-right">
                            <p
                              className={cn(
                                'text-xl font-bold font-data tracking-tighter',
                                index === 0 ? 'text-text-main' : 'text-text-main opacity-60'
                              )}
                            >
                              {store.totalLbp.toLocaleString()} LBP
                            </p>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
