import { useState, useEffect } from 'react';
import { storesApi } from '@/api/stores.api';
import { StoreCard } from '@/components/cards/StoreCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Store } from '@/types';

export function RetailerCatalogPage() {
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
    <div className="px-6 lg:px-8 py-8 animate-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Store Catalogs</h1>
        <p className="text-sm text-text-muted mt-1">
          Official prices from verified partner stores, updated daily.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-6 mb-8 p-4 bg-bg-muted/40 rounded-2xl border border-border-soft">
        <div>
          <p className="text-xs text-text-muted">Verified stores</p>
          <p className="text-xl font-bold text-text-main">{stores.length}</p>
        </div>
        <div className="w-px h-8 bg-border-soft" />
        <div>
          <p className="text-xs text-text-muted">Source</p>
          <p className="text-sm font-semibold text-green-600">Official</p>
        </div>
        <div className="w-px h-8 bg-border-soft" />
        <div>
          <p className="text-xs text-text-muted">Update cycle</p>
          <p className="text-sm font-semibold text-text-main">Every 24h</p>
        </div>
      </div>

      {/* Store grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-44 rounded-2xl bg-bg-muted animate-pulse" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <EmptyState
          icon="storefront"
          title="No verified stores yet"
          subtitle="No verified retailers are currently publishing their inventory."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((store, i) => (
            <StoreCard key={store.id} store={store} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
