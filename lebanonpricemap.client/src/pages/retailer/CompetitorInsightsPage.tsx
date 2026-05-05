import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CompetitorBarChart } from '@/components/charts/CompetitorBarChart';
import { catalogApi } from '@/api/catalog.api';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

export function CompetitorInsightsPage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    catalogApi.getInsights().then((res) => {
      const data = res.data?.data ?? res.data;
      setInsights(Array.isArray(data) ? data : []);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 lg:px-8 py-8 flex flex-col gap-8">
      <div className="flex items-center justify-between pb-6 border-b border-border-soft">
        <div>
          <h1 className="text-3xl font-black text-text-main">Market Insights</h1>
          <p className="text-sm text-text-muted mt-1">Compare your pricing against local competitors in your region</p>
        </div>
        <div className="flex items-center gap-2 bg-bg-surface border border-border-primary rounded-xl px-4 py-2 shadow-card focus-within:border-primary transition-all">
          <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '20px' }}>search</span>
          <input placeholder="Search your products..." className="bg-transparent border-none outline-none text-sm font-medium w-48 text-text-main placeholder:text-text-muted" />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2].map(i => <div key={i} className="h-96 rounded-2xl bg-bg-muted animate-pulse" />)}
        </div>
      ) : insights.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center gap-3 bg-bg-surface rounded-2xl border border-border-soft">
          <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '48px' }}>bar_chart</span>
          <p className="text-base font-bold text-text-main">No products in catalog yet</p>
          <p className="text-sm text-text-muted">Add products to your store catalog to see competitor insights.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {insights.map((insight, i) => (
            <motion.div
              key={insight.productId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-surface border border-border-soft rounded-2xl p-7 shadow-card flex flex-col gap-6 relative overflow-hidden"
            >
              <div className={cn(
                "absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl translate-x-1/2 -translate-y-1/2",
                insight.pricePosition === 'lower' ? "bg-green-500" :
                insight.pricePosition === 'higher' ? "bg-red-500" : "bg-primary"
              )} />
              
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{insight.category}</p>
                  <h2 className="text-xl font-black text-text-main mb-1">{insight.productName}</h2>
                  <p className="text-sm text-text-muted">{insight.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Your Price</p>
                  <p className="text-2xl font-black text-text-main">
                    <span className="text-sm text-text-muted mr-1 font-sans">LBP</span>
                    {insight.yourPrice.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="h-px w-full bg-border-soft" />

              <div className="flex-1 min-h-[250px]">
                <CompetitorBarChart
                  productName={insight.productName}
                  data={[
                    { store: 'Average', price: insight.marketAverage, isYou: false },
                    { store: 'You', price: insight.yourPrice, isYou: true },
                  ]}
                />
              </div>

              <div className={cn(
                "border rounded-xl p-4 flex gap-4",
                insight.pricePosition === 'lower' ? "bg-green-500/5 border-green-500/20" :
                insight.pricePosition === 'higher' ? "bg-red-500/5 border-red-500/20" : "bg-bg-muted border-border-soft"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  insight.pricePosition === 'lower' ? "bg-green-500/10 text-green-500" :
                  insight.pricePosition === 'higher' ? "bg-red-500/10 text-red-500" : "bg-bg-muted text-text-muted"
                )}>
                  <span className="material-symbols-outlined text-[20px]">
                    {insight.pricePosition === 'lower' ? 'trending_down' : 
                     insight.pricePosition === 'higher' ? 'trending_up' : 'info'}
                  </span>
                </div>
                <div>
                  <p className={cn(
                    "text-sm font-bold mb-1",
                    insight.pricePosition === 'lower' ? "text-green-600" :
                    insight.pricePosition === 'higher' ? "text-red-600" : "text-text-main"
                  )}>
                    {insight.pricePosition === 'lower' ? "Competitive Advantage" :
                     insight.pricePosition === 'higher' ? "Above Market Average" : "Price is Fair"}
                  </p>
                  <p className="text-sm text-text-sub leading-relaxed">
                    {insight.pricePosition === 'lower' ? `Your price is ${Math.round((insight.marketAverage - insight.yourPrice)/insight.marketAverage * 100)}% lower than the market average of ${insight.marketAverage.toLocaleString()} LBP.` :
                     insight.pricePosition === 'higher' ? `Your price is ${Math.round((insight.yourPrice - insight.marketAverage)/insight.marketAverage * 100)}% higher than the market average. Consider adjusting to stay competitive.` :
                     `Your price is aligned with the current market average across ${insight.competitorCount} other stores.`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
