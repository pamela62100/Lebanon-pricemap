import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  { id: 'All', label: 'All', icon: 'collections' },
  { id: 'Dairy', label: 'Dairy', icon: 'cheese' },
  { id: 'Bakery', label: 'Bakery', icon: 'bakery_dining' },
  { id: 'Meat', label: 'Meat', icon: 'kebab_dining' },
  { id: 'Grains', label: 'Grains', icon: 'grain' },
  { id: 'Produce', label: 'Produce', icon: 'nutrition' },
  { id: 'Fuel', label: 'Fuel', icon: 'local_gas_station' },
];

export function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showOfficialOnly, setShowOfficialOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'near' | 'trust' | 'price' | 'date'>('date');

  const { isOnline } = useOfflineStore();
  const { getCachedPrices } = useOfflineSync();
  const { lat, lng, city, permissionStatus, requestLocation } = useLocationStore();
  const { getParam, open } = useRouteDialog();

  const allEntries = useMemo(() => {
    return isOnline ? getEnrichedPriceEntries() : getCachedPrices();
  }, [isOnline]);

  const activeEntryId = getParam('id');
  const activeEntry = allEntries.find((e: any) => e.id === activeEntryId);

  const filteredEntries = useMemo(() => {
    let results = [...allEntries];
    
    results = results.filter((e: any) => (e.status === 'verified' || e.source === 'official') && !e.isDisputed);

    if (showOfficialOnly) {
      results = results.filter((e: any) => e.source === 'official');
    }

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
      results.sort((a: any, b: any) => {
        const distA = distanceKm(lat, lng, a.store?.latitude ?? 0, a.store?.longitude ?? 0);
        const distB = distanceKm(lat, lng, b.store?.latitude ?? 0, b.store?.longitude ?? 0);
        return distA - distB;
      });
    } else if (sortBy === 'trust') {
      results.sort((a: any, b: any) => (b.submitterTrustScore ?? 0) - (a.submitterTrustScore ?? 0));
    } else if (sortBy === 'price') {
      results.sort((a: any, b: any) => a.priceLbp - b.priceLbp);
    } else {
      results.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return results;
  }, [allEntries, query, activeCategory, sortBy, showOfficialOnly, lat, lng]);

  const mapMarkers = useMemo(() => {
    const cheapestPerProduct: Record<string, number> = {};
    filteredEntries.forEach((e: any) => {
      if (!cheapestPerProduct[e.productId] || e.priceLbp < cheapestPerProduct[e.productId]) {
        cheapestPerProduct[e.productId] = e.priceLbp;
      }
    });
    return filteredEntries
      .filter((e: any) => e.store?.latitude && e.store?.longitude)
      .map((e: any) => {
        const isBestPrice = e.priceLbp === cheapestPerProduct[e.productId];
        return {
          position: [e.store!.latitude, e.store!.longitude] as [number, number],
          label: isBestPrice ? `🌟 Best Price: ${e.product?.name}` : `${e.product?.name}`,
          price: e.priceLbp.toLocaleString(),
          category: e.product?.category,
          isBestPrice,
          storeName: e.store?.name,
        };
      });
  }, [filteredEntries]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100dvh-4rem)] bg-bg-base overflow-hidden">
      {/* ─── Left Panel: Content ─── */}
      <div className="w-full lg:w-[400px] xl:w-[460px] h-full overflow-y-auto overflow-x-hidden border-r border-border-soft bg-white/50 backdrop-blur-3xl flex flex-col relative z-20 shadow-2xl">
        
        {/* Floating Search Bar */}
        <section className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl px-6 py-6 xl:px-8 border-b border-border-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1 opacity-60">Market_Intelligence</p>
              <h1 className="text-2xl font-bold text-text-main tracking-tighter leading-none">Scout_Sector.</h1>
            </div>
            <div className="px-2.5 py-1 bg-text-main text-white rounded-full text-[8px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-text-main/10">
               <span className="w-1 h-1 rounded-full bg-white animate-pulse" /> Live
            </div>
          </div>
          
          <div className="relative mb-5 group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl text-text-muted transition-colors group-focus-within:text-text-main">search</span>
            <input
              type="text"
              placeholder="Query product or node..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-bg-muted/50 border border-border-soft rounded-xl font-bold text-[13px] tracking-tight focus:outline-none focus:bg-white focus:shadow-glass transition-all placeholder:text-text-muted/30"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300",
                  activeCategory === cat.id
                    ? "bg-text-main text-white shadow-lg shadow-text-main/10"
                    : "bg-white text-text-muted border border-border-soft hover:border-text-main/20 hover:bg-bg-muted"
                )}
              >
                <span className="material-symbols-outlined text-[16px] opacity-40">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Results Stream */}
        <div className="flex-1 px-6 xl:px-8 py-8 space-y-3">
          <div className="flex items-center justify-between mb-6 p-3 bg-bg-muted/30 rounded-xl border border-border-soft/50">
            <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-60">
              Broadcasting <span className="text-text-main font-data">{filteredEntries.length}</span> Results
            </p>
            <div className="flex p-0.5 bg-white rounded-lg border border-border-soft">
              {['date', 'price', 'near'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-[8px] font-bold uppercase tracking-widest transition-all",
                    sortBy === s ? "bg-text-main text-white shadow-md shadow-text-main/10" : "text-text-muted hover:text-text-main"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredEntries.map((entry: any, i: number) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <PriceResultCard entry={entry} index={i} />
              </motion.div>
            ))}
          </div>
          
          {filteredEntries.length === 0 && (
            <div className="py-24 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-[1.5rem] bg-bg-muted flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-3xl text-text-muted/20">search_off</span>
              </div>
              <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-40 leading-loose">
                No tactical data <br /> found in this sector.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Right Panel: Tactical Map ─── */}
      <div className="hidden lg:block flex-1 relative bg-bg-base overflow-hidden">
        <MapComponent
          center={[lat || 33.8938, lng || 35.5018]}
          zoom={13}
          markers={mapMarkers}
        />
        
        {/* Map Top HUD: Tactical Overlay */}
        <div className="absolute top-6 left-6 right-6 z-30 pointer-events-none flex justify-between items-start">
          <div className="glass p-4 rounded-[1.5rem] border border-white/40 shadow-2xl pointer-events-auto backdrop-blur-2xl bg-white/40">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-text-main flex items-center justify-center text-white shadow-lg">
                  <span className="material-symbols-outlined text-xl">explore</span>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-text-muted uppercase tracking-[0.2em] mb-0.5 opacity-60">Scanning_Area</p>
                  <p className="text-sm font-bold text-text-main tracking-tight">{city || 'Global_Net'}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-text-main/10" />
              <div>
                <p className="text-[8px] font-bold text-text-muted uppercase tracking-[0.2em] mb-0.5 opacity-60">Avg_Sector_Index</p>
                <div className="flex items-baseline gap-1.5">
                   <p className="text-lg font-bold text-text-main font-data tracking-tighter leading-none">
                    {(filteredEntries.reduce((acc: number, c: any) => acc + c.priceLbp, 0) / (filteredEntries.length || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <span className="text-[9px] font-bold text-text-muted uppercase opacity-40">LBP</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={requestLocation}
            className="w-12 h-12 glass rounded-2xl border border-white/40 flex items-center justify-center text-text-main shadow-2xl hover:bg-white pointer-events-auto transition-all hover:scale-105 active:scale-95 group"
          >
            <span className="material-symbols-outlined text-2xl group-hover:rotate-[360deg] transition-all duration-500">near_me</span>
          </button>
        </div>

        {/* Map Bottom Legend: Visual Protocols */}
        <div className="absolute left-6 bottom-6 z-30 p-4 glass rounded-[1.5rem] border border-white/40 backdrop-blur-2xl bg-white/40 shadow-2xl">
           <div className="space-y-3">
              {[
                { label: 'Tactical_Best', dot: 'bg-text-main shadow-[0_0_8px_rgba(0,0,0,0.1)]' },
                { label: 'Market_Probe', dot: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.2)]' },
              ].map(i => (
                <div key={i.label} className="flex items-center gap-3 group">
                  <div className={cn("w-2 h-2 rounded-full", i.dot)} />
                  <span className="text-[9px] font-bold text-text-main uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity">{i.label}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <ReportRealityDialog />
      <ConfirmDialog
        dialogId="report-price"
        title="Protocol_Disruption"
        description={`Flag entry for ${activeEntry?.product?.name} at ${activeEntry?.store?.name}? This triggers a manual verification cycle.`}
        confirmLabel="Initiate Flag"
        variant="warning"
        onConfirm={() => console.log('Flagged:', activeEntryId)}
      />
    </div>
  );
}