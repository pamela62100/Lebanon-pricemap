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

const CategoryPill = ({ label, icon, active, onClick }: { label: string, icon: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-5 py-2 transition-all whitespace-nowrap border rounded-full text-[11px] font-bold",
      active
        ? "bg-primary text-white border-primary shadow-md"
        : "bg-bg-surface text-text-muted border-border-primary hover:border-primary hover:text-primary"
    )}
  >
    <span className="material-symbols-outlined text-[15px]">{icon}</span>
    {label}
  </button>
);

const CATEGORIES = [
  { id: 'All', label: 'All', icon: 'collections' },
  { id: 'Dairy', label: 'Dairy', icon: 'cheese' },
  { id: 'Bakery', label: 'Bakery', icon: 'bakery_dining' },
  { id: 'Meat', label: 'Meat', icon: 'kebab_dining' },
  { id: 'Grains', label: 'Grains', icon: 'grain' },
  { id: 'Produce', label: 'Produce', icon: 'nutrition' },
  { id: 'Fuel', label: 'Fuel', icon: 'local_gas_station' },
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
      {/* ─── Left Panel ─── */}
      <div
        ref={containerRef}
        className="w-full lg:w-[45%] h-full overflow-y-auto overflow-x-hidden border-r border-border-primary custom-scrollbar bg-bg-base z-20"
      >
        <div className="p-8 md:p-10 max-w-3xl mx-auto">

          {/* Header */}
          <header className="mb-10">
            <p className="text-[11px] font-bold text-primary uppercase tracking-[0.3em] mb-3">Live Prices</p>
            <h1 className="font-sans text-4xl font-black text-text-main leading-tight mb-3">
              Find what you need,<br />near you.
            </h1>
            <p className="text-text-muted text-sm font-medium max-w-md">
              Real-time pricing from stores across Lebanon, updated by the community.
            </p>
          </header>

          {/* Proximity Module */}
          <section className="mb-8">
            <div className="rounded-xl border border-border-primary overflow-hidden">
              {!lat ? (
                <div className="bg-bg-surface p-5">
                  {permissionStatus === 'denied' ? (
                    <div className="space-y-3">
                      <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider text-center mb-3">Select your area</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {CITIES.map(c => (
                          <button
                            key={c}
                            onClick={() => setManualCity(c)}
                            className={cn(
                              "px-4 py-2 rounded-lg border text-[11px] font-bold transition-all",
                              city === c ? "bg-primary text-white border-primary" : "bg-bg-base text-text-muted border-border-soft hover:border-primary"
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
                      className="w-full group h-16 bg-bg-base rounded-lg border border-border-soft flex items-center justify-center gap-3 hover:border-primary transition-all"
                    >
                      <span className="material-symbols-outlined text-primary text-[20px]">explore</span>
                      <span className="text-[13px] font-bold text-text-main">Enable location for nearby prices</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="h-16 bg-bg-surface flex items-center justify-between px-6">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[18px]">near_me</span>
                    <div>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Your location</p>
                      <p className="text-sm font-bold text-text-main">{city}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSortByNearMe(!sortByNearMe)}
                    className={cn(
                      "px-4 py-2 rounded-lg border text-[11px] font-bold transition-all",
                      sortByNearMe ? "bg-primary text-white border-primary" : "bg-bg-base text-text-muted border-border-primary hover:border-primary"
                    )}
                  >
                    {sortByNearMe ? 'Sorted by distance' : 'Sort by distance'}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Search */}
          <div className="relative mb-6 group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-text-muted group-focus-within:text-primary transition-colors">search</span>
            <input
              type="text"
              placeholder="Search by product or store..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-5 bg-bg-surface border border-border-primary rounded-xl text-sm font-medium focus:outline-none focus:border-primary transition-all placeholder:text-text-muted/50"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-bold text-primary tracking-wider">LIVE</span>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto pb-6 hide-scrollbar">
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

          {/* Results */}
          <div className="space-y-4">
            {filteredEntries.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {filteredEntries.map((entry: any, i: number) => (
                  <PriceResultCard key={entry.id} entry={entry} index={i} />
                ))}
              </AnimatePresence>
            ) : (
              <div className="py-16 text-center border border-dashed border-border-primary/40 rounded-xl bg-bg-surface/50">
                <span className="material-symbols-outlined text-border-primary text-[40px] mb-3">inventory_2</span>
                <p className="text-sm font-bold text-text-muted">No results found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Map ─── */}
      <div className="hidden lg:block w-[55%] relative h-full bg-bg-muted">
        <div className="absolute inset-0 z-0">
          <MapComponent
            center={[lat || 33.8938, lng || 35.5018]}
            zoom={12}
            markers={mapMarkers}
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-bg-base/20 to-transparent" />
        </div>

        {/* Map Legend */}
        <div className="absolute left-6 bottom-6 z-30">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-bg-surface/95 backdrop-blur-sm border border-border-primary rounded-xl p-5 shadow-lg"
          >
            <h4 className="font-sans text-sm font-bold text-text-main mb-3">Map Legend</h4>
            <div className="space-y-2.5">
              {[
                { label: 'Best Price', color: 'bg-primary', desc: 'Verified record' },
                { label: 'Other Prices', color: 'bg-text-main', desc: 'Awaiting consensus' },
                { label: 'Store cluster', color: 'border border-primary bg-transparent', desc: 'Multiple stores' }
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={cn("w-2.5 h-2.5 rounded-full", item.color)} />
                  <div>
                    <p className="text-[11px] font-bold text-text-main leading-none">{item.label}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* GPS Controls */}
        <div className="absolute right-6 bottom-6 z-30 flex flex-col gap-2">
          <button
            onClick={requestLocation}
            className="w-12 h-12 bg-bg-surface border border-border-primary rounded-xl flex items-center justify-center text-primary shadow-lg hover:bg-primary hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">my_location</span>
          </button>
          <button className="w-12 h-12 bg-bg-surface border border-border-primary rounded-xl flex items-center justify-center text-primary shadow-lg hover:bg-primary hover:text-white transition-all">
            <span className="material-symbols-outlined text-[20px]">layers</span>
          </button>
        </div>

        {/* Stats HUD */}
        <div className="absolute top-6 left-6 right-6 z-30 pointer-events-none">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-bg-surface/90 backdrop-blur-sm border border-border-primary rounded-xl p-4 pointer-events-auto w-fit shadow-lg"
          >
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Active Records</p>
                <p className="text-xl font-black text-text-main leading-none">{filteredEntries.length}</p>
              </div>
              <div className="w-px h-8 bg-border-primary/30" />
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Avg Price</p>
                <p className="text-xl font-black text-primary leading-none">
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
        title="Flag this price"
        description={`Flag entry for ${activeEntry?.product?.name} at ${activeEntry?.store?.name}? This triggers a manual verification.`}
        confirmLabel="Flag Entry"
        variant="warning"
        onConfirm={() => console.log('Flagged:', activeEntryId)}
      />
    </div>
  );
}