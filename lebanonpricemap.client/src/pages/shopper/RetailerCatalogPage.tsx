import { useState, useEffect } from 'react';
import { storesApi } from '@/api/stores.api';
import { StoreCard } from '@/components/cards/StoreCard';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { KpiCard } from '@/components/cards/KpiCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Store } from '@/types';

export function RetailerCatalogPage() {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storesApi.getAll().then((res) => {
      const data = res.data?.data ?? res.data;
      const all = Array.isArray(data) ? data : [];
      setStores(all.filter((s: Store) => s.isVerifiedRetailer));
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-5 py-12 md:py-20 animate-page">
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        <KpiCard icon="storefront" value={stores.length} label="Verified stores" />
        <KpiCard icon="inventory_2" value="—" label="Catalog items" />
        <KpiCard icon="verified_user" value="100%" label="Official source" />
        <KpiCard icon="update" value="24h" label="Update cycle" />
      </div>

      <section>
        <div className="flex items-center justify-between mb-6 border-b border-border-soft pb-4">
          <h2 className="text-xl font-bold text-text-main">Partner supermarkets</h2>
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
            {stores.length} active
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => <div key={i} className="h-48 rounded-2xl bg-bg-muted animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stores.map((store, i) => (
              <StoreCard key={store.id} store={store} index={i} />
            ))}
          </div>
        )}

        {!isLoading && stores.length === 0 && (
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
