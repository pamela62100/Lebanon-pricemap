import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEnrichedPriceEntries, MOCK_STORES } from '@/api/mockData';
import { MapComponent } from '@/components/ui/MapComponent';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TrustBadge } from '@/components/ui/TrustBadge';

export function StorePublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const store = useMemo(() =>
    MOCK_STORES.find(s => s.id === slug || s.name.toLowerCase().replace(/\s+/g, '-') === slug),
    [slug]
  );

  const entries = useMemo(() =>
    getEnrichedPriceEntries()
      .filter(e => e.storeId === store?.id && e.status === 'verified')
      .sort((a, b) => a.priceLbp - b.priceLbp),
    [store]
  );

  if (!store) {
    return (
      <div className="min-h-dvh bg-bg-base flex flex-col items-center justify-center gap-4">
        <p className="text-text-muted">Store not found.</p>
        <button onClick={() => navigate('/map')} className="text-primary text-sm font-semibold">← Back to map</button>
      </div>
    );
  }

  const marker = [{ position: [store.latitude, store.longitude] as [number, number], label: store.name, price: '', category: undefined }];

  return (
    <div className="min-h-dvh bg-bg-base">
      {/* Public nav */}
      <header className="h-14 bg-bg-surface border-b border-border-soft flex items-center px-6 gap-3 sticky top-0 z-30">
        <button onClick={() => navigate('/map')} className="flex items-center gap-1.5 text-text-sub hover:text-primary transition-colors text-sm">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
          Live Map
        </button>
        <span className="text-border-soft">/</span>
        <span className="text-sm font-semibold text-text-main truncate">{store.name}</span>
        <div className="ml-auto flex gap-2">
          <button onClick={() => navigate('/login')} className="text-xs font-semibold px-4 py-1.5 rounded-xl border border-border-soft text-text-sub hover:border-primary hover:text-primary transition-all">Sign in</button>
          <button onClick={() => navigate('/register')} className="text-xs font-semibold px-4 py-1.5 rounded-xl bg-primary text-white hover:opacity-90">Join free</button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Store header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>storefront</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-black text-text-main">{store.name}</h1>
                {store.isVerifiedRetailer && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span>
                    Verified Retailer
                  </span>
                )}
              </div>
              <p className="text-text-muted mt-1">{store.district}, {store.city} · {store.region}</p>
              <div className="flex items-center gap-4 mt-3">
                <TrustBadge score={store.trustScore} size="sm" />
                <StatusBadge status={store.status} />
                <span className="text-xs text-text-muted">{entries.length} verified prices</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-5 gap-6">
          {/* Price list */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="col-span-3 bg-bg-surface rounded-2xl border border-border-soft overflow-hidden">
            <div className="px-6 py-4 border-b border-border-soft">
              <h2 className="text-base font-bold text-text-main">Current Prices at this Store</h2>
            </div>
            {entries.length === 0 ? (
              <div className="p-12 text-center text-text-muted">No verified prices yet for this store.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-soft">
                    <th className="text-left px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">Product</th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">Category</th>
                    <th className="text-right px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">Price LBP</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(entry => (
                    <tr
                      key={entry.id}
                      className="border-b border-border-soft last:border-0 hover:bg-bg-base/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/product/${entry.productId}`)}
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-text-main">{entry.product?.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{entry.product?.unit}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-muted">{entry.product?.category}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-base font-bold text-primary">{entry.priceLbp.toLocaleString()}</span>
                        {entry.isPromotion && (
                          <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">PROMO</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>

          {/* Map + sidebar */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="col-span-2 flex flex-col gap-4">
            <div className="rounded-2xl overflow-hidden border border-border-soft" style={{ height: '260px' }}>
              <MapComponent center={[store.latitude, store.longitude]} zoom={15} markers={marker} className="w-full h-full" />
            </div>
            <div className="bg-bg-surface rounded-2xl border border-border-soft p-5 flex flex-col gap-3">
              {[
                { icon: 'location_on', label: 'District', value: `${store.district}, ${store.city}` },
                { icon: 'lan',         label: 'Chain',    value: store.chain ?? 'Independent' },
                { icon: 'shield_check',label: 'Trust',    value: `${store.trustScore}/100` },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '18px' }}>{row.icon}</span>
                  <div>
                    <p className="text-xs text-text-muted">{row.label}</p>
                    <p className="text-sm font-semibold text-text-main">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/register')} className="w-full h-10 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-all">
              Set price alert for this store →
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
