import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { storesApi } from '@/api/stores.api';
import { catalogApi } from '@/api/catalog.api';
import { discrepancyApi } from '@/api/discrepancy.api';
import { useLiveStoreGroup, useLiveUpdate } from '@/hooks/useLiveUpdates';
import { KpiCard } from '@/components/cards/KpiCard';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SyncStatusCard } from '@/components/retailer/SyncStatusCard';
import type { Store } from '@/types';

interface CatalogItem {
  id: string;
  productId: string;
  product?: { name: string; unit?: string };
  officialPriceLbp: number;
}

interface DiscrepancyReport {
  id: string;
  productId: string;
  reportType: string;
  observedPriceLbp?: number;
  reporterTrustScore?: number;
  status: string;
}

const CITIES = ['Beirut', 'Tripoli', 'Sidon', 'Zahle', 'Jounieh', 'Dbayeh', 'Metn', 'Keserwan', 'Tyre', 'Baalbek'];

function StoreSetupScreen({ onCreated }: { onCreated: (store: Store) => void }) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('Beirut');
  const [district, setDistrict] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const res = await storesApi.createMine({ name: name.trim(), city, district: district.trim() || undefined });
      const created = (res as any).data?.data ?? (res as any).data;
      onCreated(created);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Could not create store. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-[32px]">store</span>
          </div>
          <h1 className="text-2xl font-bold text-text-main">Set up your store</h1>
          <p className="text-sm text-text-muted mt-1">Add your store details so shoppers can find you.</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Store name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Spinneys Achrafieh"
              className="w-full h-11 px-4 rounded-xl bg-bg-muted border border-border-soft text-sm font-medium text-text-main outline-none focus:border-primary/40 focus:bg-white transition-all placeholder:text-text-muted/40"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">City</label>
            <div className="relative">
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full h-11 pl-4 pr-10 rounded-xl bg-bg-muted border border-border-soft text-sm font-medium text-text-main outline-none focus:border-primary/40 appearance-none cursor-pointer"
              >
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-[18px]">unfold_more</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">District <span className="normal-case font-normal text-text-muted">(optional)</span></label>
            <input
              type="text"
              value={district}
              onChange={e => setDistrict(e.target.value)}
              placeholder="e.g. Hamra"
              className="w-full h-11 px-4 rounded-xl bg-bg-muted border border-border-soft text-sm font-medium text-text-main outline-none focus:border-primary/40 focus:bg-white transition-all placeholder:text-text-muted/40"
            />
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={!name.trim() || saving}
            className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {saving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            {saving ? 'Creating...' : 'Create my store'}
          </button>
        </form>

        <p className="text-center text-xs text-text-muted mt-4">Your store will be reviewed by our team before going live.</p>
      </motion.div>
    </div>
  );
}

export function StoreDashboardPage() {
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [pendingReports, setPendingReports] = useState<DiscrepancyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storesApi.getMine().then(async (res) => {
      const s = res.data?.data ?? res.data;
      setStore(s);
      if (s?.id) {
        const [catRes, discRes] = await Promise.all([
          catalogApi.getByStore(s.id),
          discrepancyApi.getByStore(s.id),
        ]);
        const catData = catRes.data?.data ?? catRes.data;
        setCatalog(Array.isArray(catData) ? catData : []);
        const discData = discRes.data?.data ?? discRes.data;
        setPendingReports(
          (Array.isArray(discData) ? discData : []).filter((r: DiscrepancyReport) => r.status === 'pending')
        );
      }
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  // Live: subscribe to events for this store
  useLiveStoreGroup(store?.id ?? null);

  // Catalog edits from another tab/device → refresh the catalog preview
  useLiveUpdate<{ action: string; item?: CatalogItem; id?: string }>('CatalogItemChanged', (payload) => {
    if (payload.action === 'deleted' && payload.id) {
      setCatalog(prev => prev.filter(c => c.id !== payload.id));
    } else if (payload.item) {
      setCatalog(prev => {
        const idx = prev.findIndex(c => c.id === payload.item!.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = payload.item!;
          return next;
        }
        return [payload.item!, ...prev];
      });
    }
  });

  // A resolved/approved report should drop off the dashboard
  useLiveUpdate<{ id: string }>('DiscrepancyReportResolved', ({ id }) => {
    setPendingReports(prev => prev.filter(r => r.id !== id));
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4">
        <div className="h-32 rounded-2xl bg-bg-muted animate-pulse" />
        <div className="grid grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-2xl bg-bg-muted animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!store) {
    return <StoreSetupScreen onCreated={setStore} />;
  }

  const stats = [
    { icon: 'visibility', label: 'Monthly Views', value: 0, trend: 0 },
    { icon: 'inventory_2', label: 'Listed Items', value: catalog.length, trend: 0 },
    { icon: 'local_offer', label: 'Discrepancy Reports', value: pendingReports.length, trend: 0 },
    { icon: 'verified_user', label: 'Store Trust Score', value: store.trustScore ?? 0, trend: 0 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      {/* Store Banner */}
      <div className="bg-bg-surface border border-border-soft rounded-2xl p-7 flex flex-col md:flex-row items-center justify-between shadow-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-card">
            {store.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-text-main">{store.name}</h1>
              <StatusBadge status={store.status ?? 'pending'} />
            </div>
            <p className="text-sm text-text-muted flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              {store.city}{store.district ? `, ${store.district}` : ''} · Authorized Partner
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 md:mt-0 relative z-10">
          <button onClick={() => navigate('/retailer/upload')} className="h-10 px-5 rounded-xl border border-border-soft bg-bg-surface font-semibold hover:border-primary hover:text-primary transition-colors text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            Upload CSV
          </button>
          <button onClick={() => navigate('/retailer/promotions')} className="h-10 px-5 rounded-xl border border-border-soft bg-bg-surface font-semibold hover:border-primary hover:text-primary transition-colors text-sm">
            Manage Promos
          </button>
          <button onClick={() => navigate('/retailer/insights')} className="h-10 px-5 rounded-xl bg-primary text-white font-semibold flex items-center gap-2 hover:opacity-90 text-sm transition-all">
            <span className="material-symbols-outlined text-[18px]">insights</span>
            Insights
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {stats.map(stat => (
              <KpiCard key={stat.label} {...stat} className="bg-bg-surface border border-border-soft rounded-2xl shadow-card" />
            ))}
          </div>

          <div className="bg-bg-surface border border-border-soft rounded-2xl overflow-hidden shadow-card">
            <div className="p-5 border-b border-border-soft flex items-center justify-between bg-bg-muted/30">
              <h2 className="text-base font-black text-text-main flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">inventory</span>
                Catalog Preview
              </h2>
              <button onClick={() => navigate('/retailer/products')} className="text-xs font-bold text-primary hover:underline">View all →</button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-bg-muted/50 border-b border-border-soft">
                <tr>
                  <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Product</th>
                  <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {catalog.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-bg-muted/40 transition-colors">
                    <td className="py-3 px-5 font-semibold text-text-main text-sm">
                      {item.product?.name ?? item.productId}
                    </td>
                    <td className="py-3 px-5 text-right font-black text-text-main text-sm">
                      LBP {item.officialPriceLbp.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {catalog.length === 0 && (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-sm text-text-muted">No catalog items yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <SyncStatusCard storeId={store.id} />

          <div className="bg-bg-surface border border-border-soft rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-text-main text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-[20px]">rate_review</span>
                Discrepancy Reports
              </h3>
              {pendingReports.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-500 text-[10px] font-black border border-amber-400/20">
                  {pendingReports.length} pending
                </span>
              )}
            </div>

            {pendingReports.length === 0 ? (
              <div className="text-center py-4">
                <span className="material-symbols-outlined text-green-500 text-[32px]">check_circle</span>
                <p className="text-xs text-text-muted font-bold mt-2">All catalog prices verified!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingReports.slice(0, 3).map(r => (
                  <div key={r.id} className="p-4 rounded-xl border border-amber-400/20 bg-amber-400/5">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs font-bold text-text-main">{r.productId}</p>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                        {r.reportType.replace('_', ' ')}
                      </span>
                    </div>
                    {r.observedPriceLbp && (
                      <p className="text-[11px] text-text-muted">
                        Reported: <span className="font-bold text-text-main">LBP {r.observedPriceLbp.toLocaleString()}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-border-soft flex items-center justify-between">
              <p className="text-xs text-text-muted">Catalog Items</p>
              <p className="text-sm font-black text-text-main">{catalog.length} products</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
