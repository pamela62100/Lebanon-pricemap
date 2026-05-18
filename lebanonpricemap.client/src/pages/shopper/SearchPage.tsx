import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pricesApi } from '@/api/prices.api';
import { useToastStore } from '@/store/useToastStore';
import { PriceResultCard } from '@/components/cards/PriceResultCard';
import { useLocationStore } from '@/store/useLocationStore';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { distanceKm } from '@/lib/distanceUtils';
import { useDebounce } from '@/hooks/useDebounce';

const CATEGORIES = [
  { id: 'All',     label: 'All',     icon: 'apps' },
  { id: 'Dairy',   label: 'Dairy',   icon: 'water_drop' },
  { id: 'Bakery',  label: 'Bakery',  icon: 'bakery_dining' },
  { id: 'Meat',    label: 'Meat',    icon: 'kebab_dining' },
  { id: 'Grains',  label: 'Grains',  icon: 'grain' },
  { id: 'Produce', label: 'Produce', icon: 'eco' },
  { id: 'Fuel',    label: 'Fuel',    icon: 'local_gas_station' },
];

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'near' | 'price' | 'date'>('date');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [allEntries, setAllEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { lat, lng, city } = useLocationStore();
  const { getParam } = useRouteDialog();
  const addToast = useToastStore(s => s.addToast);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setLoading(true);
    pricesApi.search({
      query: debouncedQuery || undefined,
      city: city || undefined,
      sort: sortBy === 'date' ? undefined : sortBy,
      verifiedOnly: false,
      inStockOnly: inStockOnly || undefined,
    })
      .then(res => setAllEntries(res.data?.data ?? []))
      .catch(() => {
        addToast('Could not load prices. Check your connection.', 'error');
        setAllEntries([]);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery, activeCategory, sortBy, city, inStockOnly]);

  const activeEntryId = getParam('id');
  const activeEntry = allEntries.find((e: any) => e.id === activeEntryId);

  const filteredEntries = useMemo(() => {
    let results = [...allEntries];

    if (activeCategory !== 'All') {
      results = results.filter((e: any) => e.product?.category === activeCategory);
    }

    if (sortBy === 'near' && lat && lng) {
      results.sort((a: any, b: any) =>
        distanceKm(lat, lng, a.store?.latitude ?? 0, a.store?.longitude ?? 0) -
        distanceKm(lat, lng, b.store?.latitude ?? 0, b.store?.longitude ?? 0)
      );
    } else if (sortBy === 'price') {
      results.sort((a: any, b: any) => a.priceLbp - b.priceLbp);
    } else {
      results.sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return results;
  }, [allEntries, activeCategory, sortBy, lat, lng]);


  return (
    <div className="min-h-screen bg-bg-base">
      <div className="flex flex-col">

        {/* Search header */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-border-soft px-5 py-2 sticky top-0 z-20">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-xl font-bold text-text-main">Search Prices</h1>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary text-white rounded-full text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Live
            </div>
          </div>

          <div className="relative mb-3">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-text-muted">search</span>
            <input
              type="text"
              placeholder="Search product or store..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-bg-muted border border-border-soft rounded-xl text-sm font-medium focus:outline-none focus:border-text-main/20 focus:bg-white transition-all placeholder:text-text-muted/40"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-0.5 hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border shrink-0',
                  activeCategory === cat.id
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-text-muted border-border-soft hover:border-primary/20 hover:text-text-main'
                )}
              >
                <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <p className="text-xs text-text-muted">
                {loading ? (
                  <span className="text-text-muted">Loading...</span>
                ) : (
                  <><span className="font-bold text-text-main">{filteredEntries.length}</span> results</>
                )}
              </p>
              <button
                onClick={() => setInStockOnly(v => !v)}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all',
                  inStockOnly
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-text-muted border-border-soft hover:border-green-400 hover:text-green-600'
                )}
              >
                <span className="material-symbols-outlined text-[12px]">check_circle</span>
                In stock
              </button>
            </div>
            <div className="flex p-0.5 bg-bg-muted rounded-lg border border-border-soft">
              {(['date', 'price', 'near'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide transition-all capitalize',
                    sortBy === s ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredEntries.map((entry: any, i: number) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <PriceResultCard entry={entry} index={i} />
              </motion.div>
            ))}
          </div>

          {!loading && filteredEntries.length === 0 && (
            <div className="py-20 flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-4xl text-text-muted/20 mb-3">search_off</span>
              <p className="text-sm text-text-muted">No results found.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}