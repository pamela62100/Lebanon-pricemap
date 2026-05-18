import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapComponent } from '@/components/ui/MapComponent';
import { pricesApi } from '@/api/prices.api';
import { cn } from '@/lib/utils';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';
import { useLiveUpdate } from '@/hooks/useLiveUpdates';
import { Seo } from '@/components/Seo';
import type { PriceEntry } from '@/types';

const CATEGORIES = ['All', 'Dairy', 'Bakery', 'Oil', 'Fuel', 'Meat', 'Grains', 'Beverages', 'Produce'];

export function MapPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [entries, setEntries] = useState<PriceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { rateLbpPerUsd } = useExchangeRateStore();

  useEffect(() => {
    setLoading(true);
    pricesApi.search({ verifiedOnly: true })
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setEntries(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Real-Time SignalR Events ──────────────────────────────────────────
  useLiveUpdate('PriceChanged', (payload: { storeId: string; productId: string; priceLbp: number; isPromotion: boolean; isInStock: boolean }) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.productId === payload.productId && e.storeId === payload.storeId) {
          return {
            ...e,
            priceLbp: payload.priceLbp,
            isPromotion: payload.isPromotion,
          };
        }
        return e;
      })
    );
  });

  useLiveUpdate('PriceVoted', (payload: { priceEntryId: string; upvotes: number; downvotes: number }) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id === payload.priceEntryId) {
          return {
            ...e,
            upvotes: payload.upvotes,
            downvotes: payload.downvotes,
          };
        }
        return e;
      })
    );
  });

  useLiveUpdate('CatalogItemChanged', (payload: { action: 'updated' | 'created' | 'deleted'; item: any }) => {
    if (payload.action === 'updated' && payload.item) {
      setEntries((prev) =>
        prev.map((e) => (e.id === payload.item.id ? { ...e, ...payload.item } : e))
      );
    } else if (payload.action === 'deleted' && payload.item) {
      setEntries((prev) => prev.filter((e) => e.id !== payload.item.id));
    } else if (payload.action === 'created' && payload.item) {
      if (payload.item.status === 'verified') {
        setEntries((prev) => {
          if (prev.some((e) => e.id === payload.item.id)) return prev;
          return [payload.item, ...prev];
        });
      }
    }
  });

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
        position: [Number(e.store!.latitude), Number(e.store!.longitude)] as [number, number],
        label: e.product?.name || 'Product',
        price: e.priceLbp.toLocaleString(),
        storeName: e.store?.name || 'Store',
        isBestPrice: e.upvotes ? e.upvotes > 15 : false,
      })),
    [filtered]
  );

  let sidebarContent;
  if (loading) {
    sidebarContent = [1, 2, 3, 4].map(i => (
      <div key={i} className="p-4 rounded-2xl bg-bg-muted animate-pulse h-24 border border-border-soft" />
    ));
  } else if (filtered.length === 0) {
    sidebarContent = (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 gap-2">
        <span className="material-symbols-outlined text-4xl text-text-muted/30">
          location_off
        </span>
        <p className="text-sm font-bold text-text-main">No verified prices found</p>
        <p className="text-xs text-text-muted max-w-[200px]">
          Try expanding your search query or selecting a different category.
        </p>
      </div>
    );
  } else {
    sidebarContent = filtered.slice(0, 40).map(entry => {
      const usdPrice = (entry.priceLbp / rateLbpPerUsd).toFixed(2);
      return (
        <div
          key={entry.id}
          role="button"
          tabIndex={0}
          className="p-4 rounded-2xl bg-bg-surface border border-border-soft hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer flex flex-col gap-2 relative group text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => navigate(`/app/price/${entry.id}`)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate(`/app/price/${entry.id}`);
            }
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-text-main leading-tight group-hover:text-primary transition-colors truncate">
                {entry.product?.name}
              </p>
              <p className="text-[11px] text-text-muted mt-0.5 truncate">
                {entry.product?.unit}
              </p>
            </div>
            {entry.isPromotion && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 uppercase shrink-0">
                PROMO
              </span>
            )}
          </div>

          {/* Store Info */}
          <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
            <span className="material-symbols-outlined text-[14px]">storefront</span>
            <span className="truncate font-medium">{entry.store?.name}</span>
            <span>·</span>
            <span className="shrink-0">{entry.store?.city}</span>
          </div>

          {/* Price Block */}
          <div className="pt-2 border-t border-border-soft/60 flex items-baseline justify-between mt-1">
            <div>
              <span className="text-base font-extrabold text-text-main font-data">
                {entry.priceLbp.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-text-muted ml-1">LBP</span>
            </div>
            <span className="text-xs text-text-muted font-medium">
              ≈ ${usdPrice}
            </span>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-108px)] lg:h-[calc(100vh-92px)] overflow-hidden bg-bg-base">
      <Seo
        path="/app/map"
        title="Live Price Map — WeinArkhass"
        description="Interactive map showing live verified prices at supermarkets and fuel stations across Lebanon."
      />

      {/* Control Sub-Header */}
      <div className="bg-white border-b border-border-soft px-6 py-3 flex flex-col md:flex-row items-center gap-4 shrink-0 z-10 shadow-sm">
        <div className="relative w-full md:max-w-xs shrink-0">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search product or store…"
            className="w-full pl-10 pr-4 h-10 rounded-full bg-bg-muted border border-border-soft text-sm text-text-main focus:outline-none focus:border-primary transition-all placeholder:text-text-muted/70"
          />
        </div>

        {/* Category Carousel */}
        <div className="flex gap-2 overflow-x-auto w-full no-scrollbar pb-1 md:pb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0',
                activeCategory === cat
                  ? 'bg-primary border-primary text-white shadow-sm'
                  : 'bg-bg-surface border-border-soft text-text-muted hover:text-text-main hover:bg-bg-muted'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex flex-col lg:flex-row flex-1 relative overflow-hidden">
        {/* Left Side: Leaflet Interactive Map */}
        <div className="flex-1 h-[45vh] lg:h-full relative bg-bg-muted">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-xs z-20">
              <div className="flex flex-col items-center gap-3">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">
                  progress_activity
                </span>
                <p className="text-sm font-semibold text-text-muted">Loading live verified prices...</p>
              </div>
            </div>
          ) : null}
          <MapComponent
            center={[33.8938, 35.5018]}
            zoom={12}
            markers={markers}
            className="w-full h-full"
          />
        </div>

        {/* Right Side: Scrollable Price Catalog Panel */}
        <motion.aside
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full lg:w-[360px] h-[55vh] lg:h-full bg-white border-t lg:border-t-0 lg:border-l border-border-soft flex flex-col overflow-hidden shrink-0 shadow-card lg:shadow-none"
        >
          {/* Header Summary */}
          <div className="px-5 py-4 border-b border-border-soft bg-bg-muted/30 flex items-center justify-between shrink-0">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wide">
              {filtered.length} verified listings
            </p>
            {activeCategory !== 'All' && (
              <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">
                {activeCategory}
              </span>
            )}
          </div>

          {/* Cards List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scroll-smooth">
            {sidebarContent}
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
