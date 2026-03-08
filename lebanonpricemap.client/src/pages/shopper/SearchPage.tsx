import { useState, useMemo, useRef } from 'react';
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

// ─── Sub-Components ───

const CategoryPill = ({ label, icon, active, onClick }: { label: string, icon: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-6 py-2.5 transition-all whitespace-nowrap border rounded-full text-[10px] font-black uppercase tracking-[0.2em]",
      active 
        ? "bg-primary text-white border-primary shadow-lg scale-105" 
        : "bg-white text-text-muted border-border-primary hover:border-primary hover:text-primary"
    )}
  >
    <span className="material-symbols-outlined text-[16px]">{icon}</span>
    {label}
  </button>
);

const CATEGORIES = [
  { id: 'All', label: 'All Artifacts', icon: 'collections' },
  { id: 'Dairy', label: 'Dairy', icon: 'cheese' },
  { id: 'Bakery', label: 'Bakery', icon: 'bakery_dining' },
  { id: 'Meat', label: 'Meat', icon: 'kebab_dining' },
  { id: 'Grains', label: 'Grains', icon: 'grain' },
  { id: 'Produce', label: 'Produce', icon: 'nutrition' },
  { id: 'Fuel', label: 'Fuel Archive', icon: 'local_gas_station' },
];

const CITIES = ['Beirut', 'Tripoli', 'Sidon', 'Jounieh', 'Byblos', 'Zahle', 'Tyre'];

export function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortByNearMe, setSortByNearMe] = useState(false);
  
  const { isOnline } = useOfflineStore();
  const { getCachedPrices } = useOfflineSync();
  const { lat, lng, city, permissionStatus, requestLocation, setManualCity } = useLocationStore();
  const { getParam, open } = useRouteDialog();

  const containerRef = useRef<HTMLDivElement>(null);

  const allEntries = useMemo(() => {
    return isOnline ? getEnrichedPriceEntries() : getCachedPrices();
  }, [isOnline]);

  const activeEntryId = getParam('id');
  const activeEntry = allEntries.find((e: any) => e.id === activeEntryId);

  const filteredEntries = useMemo(() => {
    let results = allEntries.filter((e: any) => e.status === 'verified');
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
    if (sortByNearMe && lat && lng) {
      results.sort((a: any, b: any) => {
        const distA = distanceKm(lat, lng, a.store?.latitude ?? 0, a.store?.longitude ?? 0);
        const distB = distanceKm(lat, lng, b.store?.latitude ?? 0, b.store?.longitude ?? 0);
        return distA - distB;
      });
    } else {
      results.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return results;
  }, [allEntries, query, activeCategory, sortByNearMe, lat, lng]);

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
    <div className="flex h-[calc(100dvh-5rem-40px)] bg-bg-base overflow-hidden">
      {/* ─── Left Panel: Intelligence Feed ─── */}
      <div 
        ref={containerRef}
        className="w-full lg:w-[45%] h-full overflow-y-auto overflow-x-hidden border-r border-border-primary custom-scrollbar bg-bg-base z-20"
      >
        <div className="p-8 md:p-12 max-w-3xl mx-auto">
          {/* Header Section */}
          <header className="mb-12">
             <div className="flex items-center gap-3 mb-4">
                <span className="h-[1px] w-8 bg-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Intelligence Panel</span>
             </div>
             <h1 className="font-serif text-5xl md:text-6xl font-black text-text-main italic leading-[0.9] mb-4">
               Market <br/> Archive
             </h1>
             <p className="text-text-muted text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-md">
               Real-time archival pricing from the Lebanese Republic's primary mercantile districts.
             </p>
          </header>

          {/* Proximity Module */}
          <section className="mb-10">
             <div className="p-1 bg-bg-muted border border-border-primary">
                {!lat ? (
                   <div className="bg-white border border-border-primary/50 p-6">
                      {permissionStatus === 'denied' ? (
                        <div className="space-y-4">
                           <p className="text-[9px] font-black text-text-muted uppercase tracking-widest text-center mb-4">Manual_Sector_Selection</p>
                           <div className="flex flex-wrap gap-2 justify-center">
                              {CITIES.map(c => (
                                <button
                                  key={c}
                                  onClick={() => setManualCity(c)}
                                  className={cn(
                                    "px-4 py-2 border text-[9px] font-black tracking-widest uppercase transition-all",
                                    city === c ? "bg-primary text-white border-primary" : "bg-white text-text-muted border-border-soft hover:border-primary"
                                  )}
                                >
                                  {c}
                                </button>
                              ))}
                           </div>
                        </div>
                      ) : (
                        <button
                          onClick={requestLocation}
                          className="w-full group relative overflow-hidden h-20 bg-white flex items-center justify-center gap-4 transition-all hover:border-primary"
                        >
                          <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-[0.02] transition-opacity" />
                          <span className="material-symbols-outlined text-primary text-[20px] transition-transform group-hover:scale-110">explore</span>
                          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-text-main">
                            INITIALIZE_LOCAL_RADAR
                          </span>
                          <div className="absolute bottom-0 left-0 h-[2px] bg-primary w-0 group-hover:w-full transition-all duration-500" />
                        </button>
                      )}
                   </div>
                ) : (
                  <div className="h-20 bg-white border border-border-primary flex items-center justify-between px-8">
                     <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary">near_me</span>
                        <div>
                           <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Active Radar</p>
                           <p className="text-xs font-serif font-black text-text-main italic">{city}</p>
                        </div>
                     </div>
                     <button
                       onClick={() => setSortByNearMe(!sortByNearMe)}
                       className={cn(
                         "px-4 py-2 border text-[9px] font-black uppercase tracking-widest transition-all",
                         sortByNearMe ? "bg-primary text-white border-primary" : "bg-white text-text-muted border-border-primary"
                       )}
                     >
                        {sortByNearMe ? 'NEARBY_SORT_ON' : 'SORT_BY_PROXIMITY'}
                     </button>
                  </div>
                )}
             </div>
          </section>

          {/* Master Search */}
          <div className="relative mb-8 group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-text-muted group-focus-within:text-primary transition-colors">search</span>
            <input
              type="text"
              placeholder="Filter by product or merchant..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-16 pl-14 pr-6 bg-white border border-border-primary text-[11px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-primary focus:ring-0 transition-all placeholder:text-text-muted/40"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
               <span className="text-[8px] font-black text-primary tracking-widest">LIVE_ENTRY</span>
            </div>
          </div>

          {/* Archive Categories */}
          <div className="flex gap-4 overflow-x-auto pb-8 hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <CategoryPill
                key={cat.id}
                label={cat.label}
                icon={cat.icon}
                active={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
              />
            ))}
          </div>

          {/* Results Feed */}
          <div className="space-y-6">
            {filteredEntries.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {filteredEntries.map((entry: any, i: number) => (
                  <PriceResultCard key={entry.id} entry={entry} index={i} />
                ))}
              </AnimatePresence>
            ) : (
              <div className="py-20 text-center border border-dashed border-border-primary/40 bg-bg-muted/30">
                <span className="material-symbols-outlined text-border-primary text-[48px] mb-4">inventory_2</span>
                <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em]">No archival records found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Cartographic HUD ─── */}
      <div className="hidden lg:block w-[55%] relative h-full bg-bg-muted">
        {/* Map Container with Archival Bleed */}
        <div className="absolute inset-0 z-0">
          <MapComponent
            center={[lat || 33.8938, lng || 35.5018]}
            zoom={12}
            markers={mapMarkers}
          />
          {/* Gallery Overlay Gradient */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-bg-base/20 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 pointer-events-none bg-gradient-to-b from-bg-base/10 to-transparent" />
        </div>

        {/* Floating HUD - Legend */}
        <div className="absolute left-8 bottom-8 z-30 space-y-4 max-w-xs">
           <motion.div 
             initial={{ x: -20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             className="bg-white border border-border-primary p-6 shadow-2xl"
           >
              <h4 className="font-serif text-lg font-black text-text-main italic mb-4 uppercase tracking-tighter">Cartographic_Legend</h4>
              <div className="space-y-4">
                 {[
                   { label: 'Bordeaux Entry', color: 'bg-primary', desc: 'Verified Record' },
                   { label: 'Graphite Entry', color: 'bg-text-main', desc: 'Awaiting Consensus' },
                   { label: 'Merchant District', color: 'border border-primary', desc: 'Central Cluster' }
                 ].map(item => (
                   <div key={item.label} className="flex items-center gap-3">
                      <div className={cn("w-3 h-3 rounded-full", item.color)} />
                      <div>
                         <p className="text-[10px] font-black text-text-main uppercase tracking-widest leading-none">{item.label}</p>
                         <p className="text-[8px] text-text-muted uppercase tracking-tighter mt-1">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </motion.div>
        </div>

        {/* Floating HUD - GPS Control */}
        <div className="absolute right-8 bottom-8 z-30 flex flex-col gap-3">
           <button 
             onClick={requestLocation}
             className="w-14 h-14 bg-white border border-border-primary flex items-center justify-center text-primary shadow-2xl hover:bg-primary hover:text-white transition-all"
           >
              <span className="material-symbols-outlined">my_location</span>
           </button>
           <button className="w-14 h-14 bg-white border border-border-primary flex items-center justify-center text-primary shadow-2xl hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined">layers</span>
           </button>
        </div>

        {/* Top Intelligence Summary */}
        <div className="absolute top-8 left-8 right-8 z-30 flex justify-between items-start pointer-events-none">
           <motion.div 
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="bg-white/80 border border-border-primary p-4 backdrop-blur-md pointer-events-auto"
           >
              <div className="flex items-center gap-6">
                 <div>
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">Active_Records</p>
                    <p className="text-xl font-serif font-black text-text-main leading-none italic">{filteredEntries.length}</p>
                 </div>
                 <div className="w-px h-8 bg-border-primary/20" />
                 <div>
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">Mercantile_Average</p>
                    <p className="text-xl font-serif font-black text-primary leading-none italic">
                      {(filteredEntries.reduce((acc: number, c: any) => acc + c.priceLbp, 0) / (filteredEntries.length || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>

      <ReportRealityDialog />
      <ConfirmDialog
        dialogId="report-price"
        title="Flag Intelligence Data"
        description={`Flag entry for ${activeEntry?.product?.name} at ${activeEntry?.store?.name}? This triggers a manual verification sweep.`}
        confirmLabel="Initialize Flag"
        variant="warning"
        onConfirm={() => console.log('Flagged:', activeEntryId)}
      />
    </div>
  );
}
