import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { OptimizerResult, CartItem } from '@/components/cart/StoreOptimizer';
import { optimizeCart } from '@/components/cart/StoreOptimizer';
import { useMemo } from 'react';

export function CartOptimizePage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const cartItems: CartItem[] = state?.cartItems ?? [];
  const result: OptimizerResult = useMemo(() => optimizeCart(cartItems), [cartItems]);

  const { singleBest, splitStrategy, allStores } = result;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <button onClick={() => navigate('/app/cart')} className="flex items-center gap-1 text-text-sub hover:text-primary transition-colors text-sm">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
          Cart
        </button>
        <div>
          <h1 className="text-3xl font-black text-text-main">Price Breakdown</h1>
          <p className="text-text-muted text-sm mt-1">{cartItems.length} products · {allStores.length} stores analysed</p>
        </div>
      </motion.div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center gap-4">
          <p className="text-text-muted">No cart items. Go back and add products.</p>
          <button onClick={() => navigate('/app/cart')} className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold">Go to Cart</button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Recommendation banner */}
          {splitStrategy ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>route</span>
              </div>
              <div>
                <p className="text-base font-bold text-text-main">
                  Splitting saves you <span className="text-primary">LBP {splitStrategy.savings.toLocaleString()}</span>
                </p>
                <p className="text-sm text-text-muted mt-0.5">
                  {splitStrategy.stores.map(s => s.storeName).join(' + ')} vs buying everything at {singleBest?.storeName}
                </p>
              </div>
            </motion.div>
          ) : singleBest ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20 flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-green-500/15 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-green-500" style={{ fontSize: '24px' }}>check_circle</span>
              </div>
              <div>
                <p className="text-base font-bold text-text-main">Best deal: buy everything at <span className="text-green-500">{singleBest.storeName}</span></p>
                <p className="text-sm text-text-muted mt-0.5">No split needed — this store covers all {cartItems.length} items at the lowest total.</p>
              </div>
            </motion.div>
          ) : null}

          {/* Side-by-side: single vs split */}
          <div className="grid grid-cols-2 gap-4">
            {/* Single best */}
            {singleBest && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-bg-surface rounded-2xl border border-border-soft overflow-hidden">
                <div className="px-5 py-4 border-b border-border-soft flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wide">Option A — Single Store</p>
                    <p className="text-base font-bold text-text-main mt-0.5">{singleBest.storeName}</p>
                    <p className="text-xs text-text-muted">{singleBest.district}</p>
                  </div>
                  <p className="text-2xl font-black text-text-main">LBP {singleBest.totalLbp.toLocaleString()}</p>
                </div>
                <div className="p-3 flex flex-col gap-1.5">
                  {singleBest.items.map(item => (
                    <div key={item.productId} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-bg-base transition-colors">
                      <p className="text-xs text-text-main">{item.productName} ×{item.quantity}</p>
                      <p className="text-xs font-bold text-text-main">{(item.priceLbp * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Split strategy */}
            {splitStrategy ? (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-primary/5 rounded-2xl border border-primary/20 overflow-hidden">
                <div className="px-5 py-4 border-b border-primary/15 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-wide">Option B — Split Trip ✦ Recommended</p>
                    <p className="text-sm font-semibold text-text-main mt-0.5">{splitStrategy.stores.map(s => s.storeName).join(' + ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary">LBP {splitStrategy.totalLbp.toLocaleString()}</p>
                    <p className="text-xs text-green-500 font-bold">Saves {splitStrategy.savings.toLocaleString()}</p>
                  </div>
                </div>
                {splitStrategy.stores.map(store => (
                  <div key={store.storeId} className="p-3 border-b border-primary/10 last:border-0">
                    <p className="text-xs font-bold text-text-sub px-2 mb-1">{store.storeName}</p>
                    {store.items.map(item => (
                      <div key={item.productId} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-primary/5 transition-colors">
                        <p className="text-xs text-text-main">{item.productName} ×{item.quantity}</p>
                        <p className="text-xs font-bold text-primary">{(item.priceLbp * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="bg-bg-surface rounded-2xl border border-border-soft flex items-center justify-center p-8 text-center">
                <div>
                  <span className="material-symbols-outlined text-text-muted mb-2" style={{ fontSize: '36px' }}>check_circle</span>
                  <p className="text-sm text-text-muted">No split needed — single store is already the cheapest option.</p>
                </div>
              </div>
            )}
          </div>

          {/* All stores table */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-bg-surface rounded-2xl border border-border-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-border-soft">
              <h2 className="text-base font-bold text-text-main">All Stores — Full Compare</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-soft">
                  <th className="text-left px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">Store</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">Items covered</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">Total LBP</th>
                </tr>
              </thead>
              <tbody>
                {allStores.sort((a, b) => a.totalLbp - b.totalLbp).map((store, i) => (
                  <tr key={store.storeId} className="border-b border-border-soft last:border-0">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {i === 0 && <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">1</span>}
                        <p className="text-sm font-semibold text-text-main">{store.storeName}</p>
                        <p className="text-xs text-text-muted">{store.district}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold ${store.coverageCount === cartItems.length ? 'text-green-500' : 'text-amber-400'}`}>
                        {store.coverageCount}/{cartItems.length}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className={`text-base font-bold ${i === 0 ? 'text-primary' : 'text-text-main'}`}>
                        {store.totalLbp.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      )}
    </div>
  );
}
