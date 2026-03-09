import { useMemo } from 'react';
import { MOCK_STORES } from '@/api/mockData';
import { StoreCard } from '@/components/cards/StoreCard';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { catalogApi } from '@/api/catalog.api';
import { discrepancyApi } from '@/api/catalog.api';
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
      {/* Hero Section */}
      <header className="mb-12">
        <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] mb-3 opacity-60">Official_Partner_Nexus</p>
        <h1 className="text-3xl md:text-5xl font-bold text-text-main tracking-tight leading-none mb-5">
          The Verified <br /> Store Catalogs.
        </h1>
        <p className="text-base text-text-muted max-w-lg leading-relaxed opacity-70">
          Direct inventory feeds from Lebanon's leading retailers. No estimates, no crowdsourced delays—just official data.
        </p>
      </header>

      {/* Stats Row - Using v3 logic */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        <KpiCard icon="storefront" value={verifiedRetailers.length} label="Verified Stores" />
        <KpiCard icon="inventory_2" value={totalCatalogItems} label="Catalog Entries" />
        <KpiCard icon="verified_user" value="100%" label="Official Source" />
        <KpiCard icon="update" value="24h" label="Sync Cycle" />
      </div>

      {/* Store Grid */}
      <section>
        <div className="flex items-center justify-between mb-8 border-b border-border-soft pb-4">
          <h2 className="text-xl font-bold text-text-main">Partner Supermarkets</h2>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest font-data">{verifiedRetailers.length} active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedRetailers.map((store, i) => (
             <StoreCard key={store.id} store={store} index={i} />
          ))}
        </div>

        {verifiedRetailers.length === 0 && (
          <EmptyState 
            icon="storefront" 
            title="Nexus Offline" 
            subtitle="No verified retailers are currently broadcasting inventory." 
          />
        )}
      </section>

      <div className="mt-20 pt-10 border-t border-border-soft">
         <button
            onClick={() => navigate('/app')}
            className="text-xs font-semibold text-text-muted hover:text-text-main transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Return to Market Pulse
          </button>
      </div>
    </div>
  );
}
