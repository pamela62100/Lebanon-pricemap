import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapComponent } from '@/components/ui/MapComponent';
import { pricesApi } from '@/api/prices.api';
import { cn } from '@/lib/utils';
import type { PriceEntry } from '@/types';

const CATEGORIES = ['All', 'Dairy', 'Bakery', 'Oil', 'Fuel', 'Meat', 'Grains', 'Beverages', 'Produce'];

export function PublicMapPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [entries, setEntries] = useState<PriceEntry[]>([]);

  useEffect(() => {
    pricesApi.search({ verifiedOnly: true }).then((res) => {
      const data = res.data?.data ?? res.data;
      setEntries(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let res = [...entries];
    if (query) {
      const q = query.toLowerCase();
      res = res.filter(e =>
        e.product?.name.toLowerCase().includes(q) ||
        e.store?.name.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== 'All') {
      res = res.filter(e => e.product?.category === activeCategory);
    }
    return res;
  }, [entries, query, activeCategory]);

  const markers = useMemo(() =>
    filtered
      .filter(e => e.store?.latitude && e.store?.longitude)
      .map(e => ({
        position: [e.store!.latitude, e.store!.longitude] as [number, number],
        label: e.product?.name || 'Product',
        price: e.priceLbp.toLocaleString(),
        category: e.product?.category,
      })),
    [filtered]
  );

  return (
    <div className="flex flex-col min-h-dvh bg-bg-base">
      <header className="h-14 bg-bg-surface border-b border-border-soft flex items-center px-6 gap-4 z-30 shrink-0">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-primary font-bold text-base">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>map</span>
          Rakis
        </button>
        <div className="flex-1 relative max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" style={{ fontSize: '18px' }}>search</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search product or store…"
            className="w-full pl-9 pr-4 h-9 rounded-xl bg-bg-muted border border-border-soft text-sm text-text-main focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                activeCategory === cat ? 'bg-primary text-white' : 'bg-bg-muted text-text-sub hover:bg-bg-muted'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => navigate('/login')} className="text-xs font-semibold px-4 py-2 rounded-xl border border-border-soft text-text-sub hover:border-primary hover:text-primary transition-all">
            Sign in
          </button>
          <button onClick={() => navigate('/register')} className="text-xs font-semibold px-4 py-2 rounded-xl bg-primary text-white hover:opacity-90 transition-all">
            Join free
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        <div className="flex-1">
          <MapComponent center={[33.8938, 35.5018]} zoom={12} markers={markers} className="w-full h-full" />
        </div>

        <motion.aside
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="w-80 bg-bg-surface border-l border-border-soft flex flex-col overflow-hidden z-10"
        >
          <div className="p-4 border-b border-border-soft">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wide">
              {filtered.length} verified prices
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {filtered.slice(0, 30).map(entry => (
              <div
                key={entry.id}
                className="p-3 rounded-xl bg-bg-base border border-border-soft hover:border-primary/40 transition-all cursor-pointer"
                onClick={() => navigate('/login')}
              >
                <p className="text-sm font-semibold text-text-main truncate">{entry.product?.name}</p>
                <p className="text-xs text-text-muted mt-0.5">{entry.store?.name} · {entry.store?.city}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-base font-bold text-primary">
                    LBP {entry.priceLbp.toLocaleString()}
                  </span>
                  {entry.isPromotion && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-status-promo-bg text-status-promo-text border border-status-promo-text/20">
                      PROMO
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border-soft bg-primary/5">
            <p className="text-xs text-text-sub mb-3 leading-relaxed">
              <strong className="text-text-main">Sign in</strong> to set price alerts, build a smart cart, and submit prices.
            </p>
            <button onClick={() => navigate('/register')} className="w-full h-9 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-all">
              Join free →
            </button>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
