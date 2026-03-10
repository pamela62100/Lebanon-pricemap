import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getEnrichedPriceEntries } from '@/api/mockData';
import { PriceResultCard } from '@/components/cards/PriceResultCard';
import { MapComponent } from '@/components/ui/MapComponent';
import { useLocationStore } from '@/store/useLocationStore';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useOfflineStore } from '@/store/useOfflineStore';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { ReportRealityDialog } from '@/components/dialogs/ReportRealityDialog';
import { distanceKm } from '@/lib/distanceUtils';

const CATEGORIES = [
  { id: 'All',     label: 'All',     icon: 'collections' },
  { id: 'Dairy',   label: 'Dairy',   icon: 'cheese' },
  { id: 'Bakery',  label: 'Bakery',  icon: 'bakery_dining' },
  { id: 'Meat',    label: 'Meat',    icon: 'kebab_dining' },
  { id: 'Grains',  label: 'Grains',  icon: 'grain' },
  { id: 'Produce', label: 'Produce', icon: 'nutrition' },
  { id: 'Fuel',    label: 'Fuel',    icon: 'local_gas_station' },
];

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'near' | 'price' | 'date'>('date');
  const [showOfficialOnly, setShowOfficialOnly] = useState(false);

  const { isOnline } = useOfflineStore();
  const { getCachedPrices } = useOfflineSync();
  const { lat, lng, city, requestLocation } = useLocationStore();
  const { getParam, open } = useRouteDialog();

  const allEntries = useMemo(() => {
    return isOnline ? getEnrichedPriceEntries() : getCachedPrices();
  }, [isOnline]);

  const activeEntryId = getParam('id');
  const activeEntry = allEntries.find((e: any) => e.id === activeEntryId);

  const filteredEntries = useMemo(() => {
    let results = [...allEntries].filter(
      (e: any) => (e.status === 'verified' || e.source === 'official') && !e.isDisputed
    );
    if (showOfficialOnly) results = results.filter((e: any) => e.source === 'official');
    if (query) {
      const q = query.toLowerCase();
      results = results.filter((e: any) =>
        e.product?.name.toLowerCase().includes(q) ||
        e.store?.name.toLowerCase().includes(q)
      );
    }
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
  }, [allEntries, query, activeCategory, sortBy, showOfficialOnly, lat, lng]);

  const mapMarkers = useMemo(() => {
    const cheapest: Record<string, number> = {};
    filteredEntries.forEach((e: any) => {
      if (!cheapest[e.productId] || e.priceLbp < cheapest[e.productId])
        cheapest[e.productId] = e.priceLbp;
    });
    return filteredEntries
      .filter((e: any) => e.store?.latitude && e.store?.longitude)
      .map((e: any) => ({
        position: [e.store!.latitude, e.store!.longitude] as [number, number],
        label: e.priceLbp === cheapest[e.productId]
          ? `Best price: ${e.product?.name}`
          : e.product?.name,
        price: e.priceLbp.toLocaleString(),
        category: e.product?.category,
        isBestPrice: e.priceLbp === cheapest[e.productId],
        storeName: e.store?.name,
      }));
  }, [filteredEntries]);

  const avgPrice = filteredEntries.length
    ? Math.round(filteredEntries.reduce((acc: number, e: any) => acc + e.priceLbp, 0) / filteredEntries.length)
    : 0;

  return (
    // Use flex-1 + overflow-hidden so it fills exactly the remaining space
    // below the sticky navbar without needing to hardcode any pixel height
    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-bg-base">

      {/* ── Left sidebar ── */}
      <div className="w-full lg:w-[400px] xl:w-[460px] flex flex-col overflow-hidden border-r border-border-soft bg-white/60 backdrop-blur-xl z-20">

        {/* Sticky search header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-border-soft px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-0.5">
                Live prices
              </p>
              <h1 className="text-xl font-bold text-text-main tracking-tight leading-none">
                Search
              </h1>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-text-main text-white rounded-full text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Live
            </div>
          </div>

          {/* Search input */}
          <div className="relative mb-3">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-text-muted">
              search
            </span>
            <input
              type="text"
              placeholder="Search product or store..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-bg-muted border border-border-soft rounded-xl text-sm font-medium focus:outline-none focus:border-text-main/20 focus:bg-white transition-all placeholder:text-text-muted/40"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border',
                  activeCategory === cat.id
                    ? 'bg-text-main text-white border-text-main'
                    : 'bg-white text-text-muted border-border-soft hover:border-text-main/20 hover:text-text-main'
                )}
              >
                <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {/* Sort + count bar */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-text-muted">
              <span className="font-bold text-text-main">{filteredEntries.length}</span> results
            </p>
            <div className="flex p-0.5 bg-bg-muted rounded-lg border border-border-soft">
              {(['date', 'price', 'near'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide transition-all capitalize',
                    sortBy === s
                      ? 'bg-text-main text-white'
                      : 'text-text-muted hover:text-text-main'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

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

          {filteredEntries.length === 0 && (
            <div className="py-20 flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-4xl text-text-muted/20 mb-3">
                search_off
              </span>
              <p className="text-sm text-text-muted">No results found.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Map panel ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <MapComponent
          center={[lat || 33.8938, lng || 35.5018]}
          zoom={13}
          markers={mapMarkers}
          className="absolute inset-0 rounded-none"
        />

        {/* Top overlay */}
        <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-start pointer-events-none">
          <div className="glass px-4 py-3 rounded-2xl shadow-lg pointer-events-auto flex items-center gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-text-main flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-base">explore</span>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">
                  Area
                </p>
                <p className="text-sm font-bold text-text-main">{city || 'Lebanon'}</p>
              </div>
            </div>
            <div className="w-px h-7 bg-border-soft" />
            <div>
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">
                Avg price
              </p>
              <p className="text-sm font-bold text-text-main font-data">
                {avgPrice.toLocaleString()} <span className="text-[10px] font-semibold text-text-muted">LBP</span>
              </p>
            </div>
          </div>

          <button
            onClick={requestLocation}
            className="w-10 h-10 glass rounded-xl flex items-center justify-center text-text-main shadow-lg hover:bg-white pointer-events-auto transition-all"
          >
            <span className="material-symbols-outlined text-xl">near_me</span>
          </button>
        </div>

        {/* Legend */}
        <div className="absolute left-4 bottom-4 z-30 glass px-4 py-3 rounded-2xl shadow-lg">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-base">👑</span>
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">Best price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-text-muted/40 border-2 border-white" />
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">Other result</span>
            </div>
          </div>
        </div>
      </div>

      <ReportRealityDialog />
      <ConfirmDialog
        dialogId="report-price"
        title="Report this price"
        description={`Flag the price for ${activeEntry?.product?.name} at ${activeEntry?.store?.name}? It will be sent for manual verification.`}
        confirmLabel="Submit report"
        variant="warning"
        onConfirm={() => console.log('Flagged:', activeEntryId)}
      />
    </div>
  );
}