import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { OptimizerResult, CartItem } from '@/components/cart/StoreOptimizer';
import { optimizeCart } from '@/components/cart/StoreOptimizer';
import { useMemo } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { getEnrichedPriceEntries, MOCK_STORES } from '@/api/mockData';
import { formatLBP, cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';

export function CartOptimizePage() {
  const navigate = useNavigate();
  const { items, getEnrichedItems } = useCartStore();
  const allPrices = useMemo(() => getEnrichedPriceEntries(), []);

  // Build CartItem[] with product names for the optimizer
  const cartItems: CartItem[] = useMemo(() =>
    getEnrichedItems().map(item => ({
      productId: item.productId,
      productName: item.product?.name ?? item.productId,
      quantity: item.quantity,
    })),
    [items]
  );

  const result: OptimizerResult = useMemo(() => optimizeCart(cartItems), [cartItems]);

  const { singleBest, splitStrategy, allStores } = result;

  return (
    <div className="max-w-7xl mx-auto px-5 py-12 md:py-20 animate-page">
      <div className="flex flex-col gap-12">
        
        {/* Navigation & Header */}
        <header className="space-y-8">
          <button 
            onClick={() => navigate('/app/cart')} 
            className="flex items-center gap-2 text-[10px] font-bold text-text-muted hover:text-text-main uppercase tracking-[0.2em] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Return_to_Inventory
          </button>
          
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">Tactical_Intelligence</p>
            <h1 className="text-5xl md:text-7xl font-bold text-text-main tracking-tighter leading-none">
              Optimization<br />Protocol.
            </h1>
            <div className="flex items-center gap-4 mt-8">
               <div className="px-3 py-1 bg-text-main text-white rounded-full text-[9px] font-bold uppercase tracking-widest">
                 {cartItems.length} Units_Analysed
               </div>
               <div className="px-3 py-1 bg-bg-muted text-text-muted rounded-full text-[9px] font-bold uppercase tracking-widest">
                 {allStores.length} Retail_Nodes
               </div>
            </div>
          </div>
        </header>

        {cartItems.length === 0 ? (
          <EmptyState 
            icon="analytics" 
            title="Zero Data Input" 
            subtitle="The optimization engine requires an active shopping list to run a market simulation."
          />
        ) : (
          <div className="space-y-8">
            {/* Strategy Insight Banner */}
            {splitStrategy ? (
              <div className="p-8 rounded-[2rem] bg-text-main text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-text-main/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <span className="material-symbols-outlined text-8xl">insights</span>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <span className="material-symbols-outlined text-3xl">route</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Financial Mastery: Split Strategy Active</h2>
                  <p className="text-sm text-white/60 mt-1 font-medium leading-relaxed max-w-2xl">
                    Dynamic routing between {splitStrategy.stores.map(s => s.storeName).join(' and ')} yields a 
                    <span className="text-white font-bold ml-1">LBP {splitStrategy.savings.toLocaleString()}</span> saving protocol.
                  </p>
                </div>
              </div>
            ) : singleBest ? (
              <div className="p-8 rounded-[2rem] bg-green-500 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-green-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <span className="material-symbols-outlined text-8xl">verified</span>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Optimal Convergence: {singleBest.storeName}</h2>
                  <p className="text-sm text-white/60 mt-1 font-medium leading-relaxed">
                    Single-source procurement provides maximum efficiency for this market slice.
                  </p>
                </div>
              </div>
            ) : null}

            {/* Strategy Comparison Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Protocol A: Single Source */}
              {singleBest && (
                <div className="card flex flex-col overflow-hidden">
                  <div className="p-8 border-b border-border-soft">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">Protocol_A // Centralized</p>
                    <h3 className="text-2xl font-bold text-text-main">{singleBest.storeName}</h3>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1 opacity-60">{singleBest.district}</p>
                  </div>
                  <div className="p-8 bg-bg-muted/30">
                     <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Exposure_Total</p>
                     <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-text-main font-data tracking-tighter">
                          {singleBest.totalLbp.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-text-muted uppercase">LBP</span>
                     </div>
                  </div>
                  <div className="flex-1 p-6 space-y-1">
                    {singleBest.items.map(item => (
                      <div key={item.productId} className="flex items-center justify-between p-3 rounded-xl hover:bg-bg-muted transition-colors">
                        <p className="text-xs font-bold text-text-main">
                          {item.productName} <span className="text-text-muted ml-1 opacity-60">×{item.quantity}</span>
                        </p>
                        <p className="text-xs font-bold text-text-main font-data">
                          {(item.priceLbp * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Protocol B: Split Strategy */}
              {splitStrategy ? (
                <div className="card flex flex-col overflow-hidden border-text-main shadow-xl shadow-text-main/5 relative">
                  <div className="absolute top-0 right-0 px-6 py-2 bg-text-main text-white text-[9px] font-bold uppercase tracking-widest rounded-bl-2xl">
                    Optimal_Target
                  </div>
                  <div className="p-8 border-b border-border-soft">
                    <p className="text-[10px] font-bold text-text-main uppercase tracking-[0.2em] mb-4">Protocol_B // Diversified</p>
                    <h3 className="text-2xl font-bold text-text-main">{splitStrategy.stores.map(s => s.storeName).join(' + ')}</h3>
                  </div>
                  <div className="p-8 bg-text-main/[0.03] grid grid-cols-2 gap-8">
                     <div>
                        <p className="text-[10px] font-bold text-text-main uppercase tracking-widest mb-1">Procurement_Target</p>
                        <div className="flex items-baseline gap-2">
                           <span className="text-4xl font-bold text-text-main font-data tracking-tighter">
                             {splitStrategy.totalLbp.toLocaleString()}
                           </span>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Delta_Savings</p>
                        <div className="flex items-baseline justify-end gap-1 text-green-600">
                           <span className="text-2xl font-bold font-data">-{splitStrategy.savings.toLocaleString()}</span>
                           <span className="text-[9px] font-bold uppercase">LBP</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex-1 divide-y divide-border-soft/40">
                    {splitStrategy.stores.map(store => (
                      <div key={store.storeId} className="p-6">
                        <p className="text-[9px] font-bold text-text-main opacity-40 uppercase tracking-widest mb-3">{store.storeName}</p>
                        <div className="space-y-1">
                           {store.items.map(item => (
                             <div key={item.productId} className="flex items-center justify-between p-2 rounded-lg hover:bg-text-main/5 transition-colors">
                               <p className="text-xs font-bold text-text-main">
                                 {item.productName} <span className="text-text-muted ml-1 opacity-60">×{item.quantity}</span>
                               </p>
                               <p className="text-xs font-bold text-text-main font-data">
                                 {(item.priceLbp * item.quantity).toLocaleString()}
                               </p>
                             </div>
                           ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="card p-12 border-dashed flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-5xl text-text-muted/20 mb-6">psychology</span>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2">Split_Convergence_Null</p>
                  <p className="text-sm font-medium text-text-muted opacity-60 max-w-xs leading-relaxed">
                    Artificial Intelligence has determined that single-source procurement is already at the maximum efficiency ceiling.
                  </p>
                </div>
              )}
            </div>

            {/* Full Nodes Analytics */}
            <section className="card overflow-hidden mt-12">
               <div className="p-8 border-b border-border-soft flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-text-main tracking-tight">Nodes Analytics.</h2>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1 opacity-60">Full Market Simulation Data</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[9px] font-bold uppercase tracking-widest">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                     Live_Feeds_Active
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-bg-muted/30">
                        <th className="px-8 py-5 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">Retail_Node</th>
                        <th className="px-8 py-5 text-center text-[10px] font-bold text-text-muted uppercase tracking-widest">Inventory_Match</th>
                        <th className="px-8 py-5 text-right text-[10px] font-bold text-text-muted uppercase tracking-widest">Total_Procurement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-soft/40">
                      {allStores.sort((a, b) => a.totalLbp - b.totalLbp).map((store, i) => (
                        <tr key={store.storeId} className="group hover:bg-bg-muted/10 transition-colors">
                          <td className="px-8 py-8">
                            <div className="flex items-center gap-6">
                               <div className={cn(
                                 "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold font-data",
                                 i === 0 ? "bg-text-main text-white" : "bg-bg-muted text-text-muted"
                               )}>
                                 {String(i + 1).padStart(2, '0')}
                               </div>
                               <div>
                                  <p className="font-bold text-text-main group-hover:text-text-main transition-colors">{store.storeName}</p>
                                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1 opacity-40">{store.district}</p>
                               </div>
                            </div>
                          </td>
                          <td className="px-8 py-8 text-center">
                             <div className={cn(
                               "inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                               store.coverageCount === cartItems.length 
                                 ? "bg-green-500/10 text-green-600" 
                                 : "bg-amber-500/10 text-amber-600"
                             )}>
                               {store.coverageCount} / {cartItems.length} UNITS
                             </div>
                          </td>
                          <td className="px-8 py-8 text-right">
                             <p className={cn(
                               "text-xl font-bold font-data tracking-tighter",
                               i === 0 ? "text-text-main" : "text-text-main opacity-60"
                             )}>
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
