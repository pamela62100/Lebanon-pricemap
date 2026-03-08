import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEnrichedPriceEntries, MOCK_PRODUCTS } from '@/api/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriceHistoryChart } from '@/components/charts/PriceHistoryChart';

export function ProductPublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const product = useMemo(() =>
    MOCK_PRODUCTS.find(p => p.id === slug || p.name.toLowerCase().replace(/\s+/g, '-') === slug),
    [slug]
  );

  const entries = useMemo(() =>
    getEnrichedPriceEntries()
      .filter(e => e.productId === product?.id && e.status === 'verified')
      .sort((a, b) => a.priceLbp - b.priceLbp),
    [product]
  );

  const lowestPrice = entries[0]?.priceLbp ?? 0;
  const highestPrice = entries[entries.length - 1]?.priceLbp ?? 0;
  const avgPrice = entries.length ? Math.round(entries.reduce((s, e) => s + e.priceLbp, 0) / entries.length) : 0;

  const chartData = useMemo(() =>
    entries.slice(0, 10).map((e, i) => ({
      date: new Date(Date.now() - i * 86400000 * 2).toISOString().split('T')[0],
      price: e.priceLbp / 1000,
    })).reverse(),
    [entries]
  );

  if (!product) {
    return (
      <div className="min-h-dvh bg-bg-base flex flex-col items-center justify-center gap-4">
        <p className="text-text-muted">Product not found.</p>
        <button onClick={() => navigate('/map')} className="text-primary text-sm font-semibold">← Back to map</button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg-base">
      {/* Public nav */}
      <header className="h-14 bg-bg-surface border-b border-border-soft flex items-center px-6 gap-3 sticky top-0 z-30">
        <button onClick={() => navigate('/map')} className="flex items-center gap-1.5 text-text-sub hover:text-primary transition-colors text-sm">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
          Live Map
        </button>
        <span className="text-border-soft">/</span>
        <span className="text-sm font-semibold text-text-main truncate">{product.name}</span>
        <div className="ml-auto flex gap-2">
          <button onClick={() => navigate('/login')} className="text-xs font-semibold px-4 py-1.5 rounded-xl border border-border-soft text-text-sub hover:border-primary hover:text-primary transition-all">Sign in</button>
          <button onClick={() => navigate('/register')} className="text-xs font-semibold px-4 py-1.5 rounded-xl bg-primary text-white hover:opacity-90">Join free</button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Product header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>inventory_2</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-text-main">{product.name}</h1>
              <p className="text-text-muted mt-1">{product.nameAr} · {product.unit} · {product.category}</p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Cheapest', value: `LBP ${lowestPrice.toLocaleString()}`, highlight: true },
              { label: 'Average',  value: `LBP ${avgPrice.toLocaleString()}`,    highlight: false },
              { label: 'Most Expensive', value: `LBP ${highestPrice.toLocaleString()}`, highlight: false },
            ].map(stat => (
              <div key={stat.label} className="p-5 rounded-2xl bg-bg-surface border border-border-soft">
                <p className="text-xs text-text-muted font-semibold uppercase tracking-wide mb-1">{stat.label}</p>
                <p className={`text-xl font-black ${stat.highlight ? 'text-primary' : 'text-text-main'}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Price comparison table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-bg-surface rounded-2xl border border-border-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-border-soft flex items-center justify-between">
            <h2 className="text-base font-bold text-text-main">Price Comparison — {entries.length} stores</h2>
            <span className="text-xs text-text-muted">Sorted cheapest first</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-soft">
                <th className="text-left px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">#</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">Store</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">District</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">Price LBP</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">vs Cheapest</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => {
                const diff = entry.priceLbp - lowestPrice;
                const pct = lowestPrice > 0 ? ((diff / lowestPrice) * 100).toFixed(0) : '0';
                return (
                  <tr key={entry.id} className="border-b border-border-soft last:border-0 hover:bg-bg-base/50 transition-colors">
                    <td className="px-6 py-4">
                      {i === 0
                        ? <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">1</span>
                        : <span className="text-sm text-text-muted">{i + 1}</span>
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-text-main">{entry.store?.name}</p>
                        {entry.store?.isVerifiedRetailer && (
                          <span className="material-symbols-outlined text-primary" style={{ fontSize: '14px' }}>verified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">{entry.store?.district}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-base font-bold ${i === 0 ? 'text-primary' : 'text-text-main'}`}>
                        {entry.priceLbp.toLocaleString()}
                      </span>
                      {entry.isPromotion && (
                        <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">PROMO</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {diff === 0
                        ? <span className="text-xs font-bold text-green-500">Cheapest</span>
                        : <span className="text-xs text-red-400">+{Number(pct)}% (+{diff.toLocaleString()})</span>
                      }
                    </td>
                    <td className="px-6 py-4 text-right">
                      <StatusBadge status={entry.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Price history */}
        {chartData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-bg-surface rounded-2xl border border-border-soft p-6">
            <h2 className="text-base font-bold text-text-main mb-4">Price History (×1000 LBP)</h2>
            <PriceHistoryChart data={chartData} />
          </motion.div>
        )}

        {/* Sign-up CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-primary/5 border border-primary/20 rounded-2xl p-8 flex items-center justify-between gap-6">
          <div>
            <p className="text-base font-bold text-text-main">Get a price alert for this product</p>
            <p className="text-sm text-text-muted mt-1">We'll notify you when the price drops below your threshold at any store.</p>
          </div>
          <button onClick={() => navigate('/register')} className="shrink-0 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-all">
            Join free →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
