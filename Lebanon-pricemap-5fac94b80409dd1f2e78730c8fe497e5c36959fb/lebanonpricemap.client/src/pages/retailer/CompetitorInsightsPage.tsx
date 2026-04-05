import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CompetitorBarChart } from '@/components/charts/CompetitorBarChart';
import { productsApi } from '@/api/products.api';
import type { Product } from '@/types';

export function CompetitorInsightsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    productsApi.getAll().then((res) => {
      const data = res.data?.data ?? res.data;
      setProducts(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, []);

  const p1 = products[0];
  const p2 = products[1];

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

      {products.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center gap-3 bg-bg-surface rounded-2xl border border-border-soft">
          <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '48px' }}>bar_chart</span>
          <p className="text-base font-bold text-text-main">No products in catalog yet</p>
          <p className="text-sm text-text-muted">Add products to your store catalog to see competitor insights.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {p1 && (
            <div className="bg-bg-surface border border-border-soft rounded-2xl p-7 shadow-card flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full opacity-10 blur-3xl translate-x-1/2 -translate-y-1/2" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{p1.category}</p>
                  <h2 className="text-xl font-black text-text-main mb-1">{p1.name}</h2>
                  <p className="text-sm text-text-muted">{p1.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Your Price</p>
                  <p className="text-2xl font-black text-text-main">
                    <span className="text-sm text-text-muted mr-1 font-sans">LBP</span>—
                  </p>
                </div>
              </div>
              <div className="h-px w-full bg-border-soft" />
              <div className="flex-1 min-h-[250px]">
                <CompetitorBarChart
                  productName={p1.name}
                  data={[
                    { store: 'Average', price: 0, isYou: false },
                    { store: 'You', price: 0, isYou: true },
                  ]}
                />
              </div>
              <div className="bg-bg-muted border border-border-soft rounded-xl p-4 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-bg-muted text-text-muted flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">info</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-text-muted mb-1">Set your price to compare</p>
                  <p className="text-sm text-text-sub leading-relaxed">
                    Update your catalog price for this product to see how you compare to the market average.
                  </p>
                </div>
              </div>
            </div>
          )}

          {p2 && (
            <div className="bg-bg-surface border border-border-soft rounded-2xl p-7 shadow-card flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 rounded-full opacity-10 blur-3xl translate-x-1/2 -translate-y-1/2" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{p2.category}</p>
                  <h2 className="text-xl font-black text-text-main mb-1">{p2.name}</h2>
                  <p className="text-sm text-text-muted">{p2.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Your Price</p>
                  <p className="text-2xl font-black text-text-main">
                    <span className="text-sm text-text-muted mr-1 font-sans">LBP</span>—
                  </p>
                </div>
              </div>
              <div className="h-px w-full bg-border-soft" />
              <div className="flex-1 min-h-[250px]">
                <CompetitorBarChart
                  productName={p2.name}
                  data={[
                    { store: 'Average', price: 0, isYou: false },
                    { store: 'You', price: 0, isYou: true },
                  ]}
                />
              </div>
              <div className="bg-bg-muted border border-border-soft rounded-xl p-4 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-bg-muted text-text-muted flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">info</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-text-muted mb-1">Set your price to compare</p>
                  <p className="text-sm text-text-sub leading-relaxed">
                    Update your catalog price for this product to see how you compare to the market average.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
