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
      <div className="p-20 text-center opacity-40">
        <h2 className="text-2xl font-bold text-text-main mb-4">Store not found</h2>
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
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const initials = store.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-bg-base animate-page">
      <header className="card-dark rounded-none border-x-0 border-t-0 py-14 px-8 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="w-28 h-28 rounded-3xl bg-white border-4 border-white/10 shadow-xl flex items-center justify-center shrink-0">
              <span className="font-bold text-4xl text-text-main/20 italic">{initials}</span>
            </div>

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="material-symbols-outlined text-white/40" style={{ fontSize: '13px' }}>verified_user</span>
                <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                  {store.chain || 'Independent'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none mb-3">
                {store.name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-3 text-white/50">
                <span className="text-sm">{store.district}, {store.city}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-status-verified">
                  Verified Partner
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/catalog')}
            className="btn-icon bg-white/10 text-white hover:bg-white/20 border-white/10 self-start md:self-auto"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 md:px-12 py-10 flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-full lg:w-56 shrink-0 space-y-6">
          <div>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-3">
              Store metrics
            </p>
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
              <div className="card p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-text-muted">payments</span>
                  <span className="text-[10px] font-semibold text-text-muted">Store rate</span>
                </div>
                <p className="text-base font-bold text-text-main font-data leading-tight">
                  {store.internalRateLbp?.toLocaleString() ?? '—'}
                  <span className="text-[10px] font-semibold text-text-muted ml-1">LBP</span>
                </p>
              </div>

              <div className="card p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-text-muted">verified</span>
                  <span className="text-[10px] font-semibold text-text-muted">Trust score</span>
                </div>
                <p className="text-base font-bold text-green-600 font-data leading-tight">
                  {store.trustScore}%
                </p>
              </div>

              <div className="card p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-text-muted">
                    {store.powerStatus === 'stable' ? 'bolt' : 'flash_off'}
                  </span>
                  <span className="text-[10px] font-semibold text-text-muted">Power</span>
                </div>
                <p className="text-sm font-bold text-text-main leading-tight capitalize">
                  {(store.powerStatus ?? 'unknown').replace(/_/g, ' ')}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border-soft space-y-3">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
              Location
            </p>
            <div>
              <p className="text-[10px] font-semibold text-text-muted uppercase mb-0.5">Area</p>
              <p className="text-sm font-semibold text-text-main">{store.region}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-text-muted uppercase mb-0.5">Coordinates</p>
              <p className="text-xs font-semibold text-text-main font-data">
                {store.latitude?.toFixed(4) ?? '—'}, {store.longitude?.toFixed(4) ?? '—'}
              </p>
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
