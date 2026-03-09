import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { MOCK_STORES } from '@/api/mockData';
import { motion } from 'framer-motion';
import { StoreCatalogView } from '@/components/catalog/StoreCatalogView';
import { KpiCard } from '@/components/cards/KpiCard';

export function RetailerCatalogDetailPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();

  const store = useMemo(() => MOCK_STORES.find(s => s.id === storeId), [storeId]);

  if (!store) {
    return (
      <div className="p-20 text-center opacity-40">
        <h2 className="text-2xl font-bold text-text-main mb-4">Tactical Data Unavailable</h2>
        <button onClick={() => navigate('/app/catalog')} className="text-sm font-bold text-text-muted hover:text-text-main transition-colors uppercase tracking-widest">
          Return to Nexus
        </button>
      </div>
    );
  }

  const initials = store.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-bg-base animate-page">
      {/* Store Hero: Dark Contrast header */}
      <header className="card-dark rounded-none border-x-0 border-t-0 py-20 px-8 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
             <div className="w-40 h-40 rounded-[2.5rem] bg-white border-8 border-white/10 shadow-glass flex items-center justify-center shrink-0">
                {store.logoUrl ? (
                  <img src={store.logoUrl} alt={store.name} className="w-28 h-28 object-contain" />
                ) : (
                  <span className="font-bold text-5xl text-text-main/20 italic">{initials}</span>
                )}
             </div>
             
             <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                   <span className="material-symbols-outlined text-white/40" style={{ fontSize: '14px' }}>verified_user</span>
                   <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{store.chain || 'Independent'} // PROTOCOL_V3</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter leading-none mb-3">{store.name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-4 text-white/50">
                  <span className="text-sm font-medium">{store.district}, {store.city}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-status-verified">Verified Partner</span>
                </div>
             </div>
          </div>

          <button
            onClick={() => navigate('/app/catalog')}
            className="btn-icon bg-white/10 text-white hover:bg-white/20 border-white/10"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Left Column: Intelligence */}
        <div className="space-y-8">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-6">Market_Metrics</p>
            <div className="grid grid-cols-1 gap-4">
              <KpiCard icon="payments" value={store.internalRateLbp.toLocaleString()} label="Store Rate" />
              <KpiCard icon="verified" value={`${store.trustScore}%`} label="Trust Score" />
              <KpiCard 
                 icon={store.powerStatus === 'stable' ? 'bolt' : 'flash_off'} 
                 value={store.powerStatus} 
                 label="Power Status" 
              />
            </div>
          </div>

          <div className="pt-8 border-t border-border-soft">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">Location_Intel</p>
            <div className="space-y-4">
               <div>
                  <p className="text-[9px] font-bold text-text-muted uppercase mb-1">Sector</p>
                  <p className="text-sm font-bold text-text-main">{store.region}</p>
               </div>
               <div>
                  <p className="text-[9px] font-bold text-text-muted uppercase mb-1">Coordinates</p>
                  <p className="text-sm font-bold text-text-main font-data">{store.latitude.toFixed(4)}, {store.longitude.toFixed(4)}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Catalog Stream */}
        <div className="lg:col-span-3">
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
