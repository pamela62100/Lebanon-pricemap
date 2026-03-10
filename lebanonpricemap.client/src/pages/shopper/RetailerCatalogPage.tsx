import { useMemo } from 'react';
import { MOCK_STORES } from '@/api/mockData';
import { StoreCard } from '@/components/cards/StoreCard';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { catalogApi } from '@/api/catalog.api';
import { KpiCard } from '@/components/cards/KpiCard';
import { EmptyState } from '@/components/ui/EmptyState';

export function RetailerCatalogPage() {
  const navigate = useNavigate();
  const verifiedRetailers = useMemo(() =>
    MOCK_STORES.filter(s => s.isVerifiedRetailer), []);

  const totalCatalogItems = useMemo(() =>
    verifiedRetailers.reduce((acc, s) => acc + catalogApi.getByStore(s.id).length, 0),
    [verifiedRetailers]
  );

  return (
    <div className="max-w-7xl mx-auto px-5 py-12 md:py-20 animate-page">
      {/* Hero */}
      <header className="mb-12">
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-3">
          Official store catalogs
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-text-main tracking-tight leading-tight mb-4">
          Verified store <br /> catalogs
        </h1>
        <p className="text-base text-text-muted max-w-lg leading-relaxed">
          Direct inventory feeds from Lebanon's leading retailers — official prices, updated daily.
        </p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        <KpiCard icon="storefront" value={verifiedRetailers.length} label="Verified stores" />
        <KpiCard icon="inventory_2" value={totalCatalogItems} label="Catalog items" />
        <KpiCard icon="verified_user" value="100%" label="Official source" />
        <KpiCard icon="update" value="24h" label="Update cycle" />
      </div>

      {/* Store grid */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b border-border-soft pb-4">
          <h2 className="text-xl font-bold text-text-main">Partner supermarkets</h2>
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
            {verifiedRetailers.length} active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {verifiedRetailers.map((store, i) => (
            <StoreCard key={store.id} store={store} index={i} />
          ))}
        </div>

        {verifiedRetailers.length === 0 && (
          <EmptyState
            icon="storefront"
            title="No verified stores yet"
            subtitle="No verified retailers are currently publishing their inventory."
          />
        )}
      </section>

      <div className="mt-16 pt-8 border-t border-border-soft">
        <button
          onClick={() => navigate('/app')}
          className="text-xs font-semibold text-text-muted hover:text-text-main transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to market overview
        </button>
      </div>
    </div>
  );
}