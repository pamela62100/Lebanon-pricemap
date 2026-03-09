import { motion } from 'framer-motion';
import { CompetitorBarChart } from '@/components/charts/CompetitorBarChart';
import { getEnrichedProducts } from '@/api/mockData';

export function CompetitorInsightsPage() {
  const p1 = getEnrichedProducts()[0];
  const p2 = getEnrichedProducts()[1];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto flex flex-col gap-8">
      
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Insight Card 1 */}
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
                <span className="text-sm text-text-muted mr-1 font-sans">LBP</span>85,000
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-border-soft" />

          <div className="flex-1 min-h-[250px]">
            <CompetitorBarChart
              productName={p1.name}
              data={[
                { store: 'Average', price: 92000, isYou: false },
                { store: 'You', price: 85000, isYou: true },
                { store: 'Market X', price: 89000, isYou: false },
                { store: 'Market Y', price: 95000, isYou: false },
              ]}
            />
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">trending_down</span>
            </div>
            <div>
              <p className="text-sm font-bold text-green-600 mb-1">Competitive Advantage</p>
              <p className="text-sm text-text-main opacity-90 leading-relaxed">
                You are currently LBP 7,000 cheaper than the regional average. Consider marking this as a promotion to drive foot traffic.
              </p>
            </div>
          </div>
        </div>

        {/* Insight Card 2 */}
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
                <span className="text-sm text-text-muted mr-1 font-sans">LBP</span>550,000
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-border-soft" />

          <div className="flex-1 min-h-[250px]">
            <CompetitorBarChart
              productName={p2.name}
              data={[
                { store: 'Average', price: 480000, isYou: false },
                { store: 'Market X', price: 460000, isYou: false },
                { store: 'Market Y', price: 510000, isYou: false },
                { store: 'You', price: 550000, isYou: true },
              ]}
            />
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
            <div>
              <p className="text-sm font-bold text-red-500 mb-1">Price Warning</p>
              <p className="text-sm text-text-main opacity-90 leading-relaxed">
                You are LBP 70,000 above the regional average. Consider lowering the price to remain competitive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}