import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { storesApi } from '@/api/stores.api';
import { StoreCatalogView } from '@/components/catalog/StoreCatalogView';
import type { Store } from '@/types';

export function RetailerCatalogDetailPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!storeId) return;
    storesApi.getById(storeId).then((res) => {
      const data = res.data?.data ?? res.data;
      if (data?.id) setStore(data);
      else setNotFound(true);
    }).catch(() => setNotFound(true));
  }, [storeId]);

  if (notFound) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-xl font-bold text-text-main mb-4">Store not found</h2>
        <button
          onClick={() => navigate('/app/catalog')}
          className="text-sm font-semibold text-text-muted hover:text-text-main transition-colors"
        >
          ← Back to catalogs
        </button>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="p-20 text-center">
        <div className="h-8 w-8 border-2 border-text-main border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const initials = store.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-bg-base animate-page">
      {/* Store header */}
      <header className="card-dark rounded-none border-x-0 border-t-0 py-10 px-8 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/10 shadow-xl flex items-center justify-center shrink-0">
              <span className="font-bold text-3xl text-white/40">{initials}</span>
            </div>

            <div className="text-center md:text-left">
              <p className="text-sm text-white/40 mb-1">{store.chain || 'Independent'}</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
                {store.name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-white/50 text-sm flex-wrap">
                <span>{store.district}{store.city ? `, ${store.city}` : ''}</span>
                {store.isVerifiedRetailer && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-green-400 text-xs font-semibold">Verified Partner</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/catalog')}
            className="flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white transition-colors self-start md:self-auto"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            All stores
          </button>
        </div>
      </header>

      <div className="px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar */}
        <aside className="w-full lg:w-48 shrink-0">
          <div className="card p-4 space-y-3">
            <p className="text-xs font-semibold text-text-muted">Store details</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-text-muted">Store rate</p>
                <p className="text-sm font-bold text-text-main font-data">
                  {store.internalRateLbp?.toLocaleString() ?? '—'} <span className="text-[10px] font-normal text-text-muted">LBP</span>
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-text-muted">Trust</p>
                <p className="text-sm font-bold text-green-600">{store.trustScore}%</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-text-muted">Power</p>
                <p className="text-sm font-medium text-text-main capitalize">
                  {(store.powerStatus ?? 'unknown').replace(/_/g, ' ')}
                </p>
              </div>
              {store.region && (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-muted">Area</p>
                  <p className="text-sm font-medium text-text-main">{store.region}</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <StoreCatalogView
            storeId={store.id}
            storeName={store.name}
            isVerified={store.isVerifiedRetailer}
          />
        </div>
      </div>
    </div>
  );
}
