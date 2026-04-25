import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrustBadge } from '@/components/ui/TrustBadge';
import { useToastStore } from '@/store/useToastStore';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { storesApi } from '@/api/stores.api';
import { cn } from '@/lib/utils';
import type { Store } from '@/types';

type StoreStatus = 'pending' | 'verified' | 'flagged';

const STATUS_TABS = ['all', 'pending', 'verified', 'flagged'];

export function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [searchQ, setSearchQ] = useState('');
  const addToast = useToastStore(s => s.addToast);
  const { open, getParam } = useRouteDialog();

  const activeStoreId = getParam('id');
  const activeStore = stores.find(s => s.id === activeStoreId);

  useEffect(() => {
    storesApi.getAll().then((res) => {
      const data = res.data?.data ?? res.data;
      setStores(Array.isArray(data) ? data : []);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const getEffectiveStatus = (store: Store): StoreStatus => {
    if (store.status === 'flagged') return 'flagged';
    if (store.status === 'verified' || store.isVerifiedRetailer) return 'verified';
    return 'pending';
  };

  const filtered = useMemo(() => {
    let res = stores;
    if (tab !== 'all') res = res.filter(s => getEffectiveStatus(s) === tab);
    if (searchQ) {
      const q = searchQ.toLowerCase();
      res = res.filter(s => s.name.toLowerCase().includes(q) || (s.district ?? '').toLowerCase().includes(q));
    }
    return res;
  }, [stores, tab, searchQ]);

  const counts = useMemo(() => ({
    all: stores.length,
    pending: stores.filter(s => getEffectiveStatus(s) === 'pending').length,
    verified: stores.filter(s => getEffectiveStatus(s) === 'verified').length,
    flagged: stores.filter(s => getEffectiveStatus(s) === 'flagged').length,
  }), [stores]);

  const changeStatus = async (id: string, status: StoreStatus) => {
    try {
      await storesApi.updateStatus(id, status);
      setStores(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      const label = { verified: 'approved', pending: 'set to pending', flagged: 'flagged' }[status];
      addToast(`Store ${label}`, status === 'verified' ? 'success' : status === 'flagged' ? 'error' : 'info');
    } catch (err) {
      console.error('Failed to update store status:', err);
      addToast('Failed to update store status', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-main">Store Management</h1>
          <p className="text-text-muted text-sm mt-1">{stores.length} total stores · {counts.pending} pending approval</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Stores',  value: counts.all,       icon: 'storefront',   color: 'text-text-main' },
          { label: 'Pending',       value: counts.pending,   icon: 'pending',      color: 'text-amber-400' },
          { label: 'Verified',      value: counts.verified,  icon: 'check_circle', color: 'text-green-500' },
          { label: 'Flagged',       value: counts.flagged,   icon: 'block',        color: 'text-red-400'   },
        ].map(kpi => (
          <div key={kpi.label} className="bg-bg-surface rounded-2xl border border-border-soft p-5 flex items-center gap-4">
            <span className={`material-symbols-outlined ${kpi.color}`} style={{ fontSize: '28px' }}>{kpi.icon}</span>
            <div>
              <p className="text-2xl font-black text-text-main">{kpi.value}</p>
              <p className="text-xs text-text-muted">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-1 bg-bg-surface border border-border-soft rounded-xl p-1">
          {STATUS_TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all',
                tab === t ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main'
              )}>
              {t} ({counts[t as keyof typeof counts] ?? counts.all})
            </button>
          ))}
        </div>
        <div className="relative max-w-64 flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" style={{ fontSize: '16px' }}>search</span>
          <input type="text" placeholder="Search stores…" value={searchQ} onChange={e => setSearchQ(e.target.value)}
            className="w-full pl-8 pr-3 h-9 rounded-xl bg-bg-surface border border-border-soft text-sm text-text-main focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div className="bg-bg-surface rounded-2xl border border-border-soft overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-12 rounded-xl bg-bg-muted animate-pulse" />)}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-soft bg-bg-muted/30">
                {['Store', 'District', 'Trust', 'Status', 'Verified', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-text-muted">No stores found.</td>
                </tr>
              ) : filtered.map(store => {
                const effectiveStatus = getEffectiveStatus(store);
                return (
                  <tr key={store.id} className="border-b border-border-soft last:border-0 hover:bg-bg-base/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-text-main">{store.name}</p>
                        {store.chain && <span className="text-[10px] text-text-muted font-medium px-1.5 py-0.5 rounded bg-bg-muted">{store.chain}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-text-muted">{store.district}, {store.city}</td>
                    <td className="px-5 py-4"><TrustBadge score={store.trustScore} size="sm" /></td>
                    <td className="px-5 py-4">
                      <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full capitalize',
                        effectiveStatus === 'verified' ? 'bg-green-500/10 text-green-500'
                        : effectiveStatus === 'pending' ? 'bg-amber-400/10 text-amber-400'
                        : 'bg-red-400/10 text-red-400'
                      )}>
                        {effectiveStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {store.isVerifiedRetailer
                        ? <span className="text-xs text-green-500 font-bold flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span> Yes</span>
                        : <span className="text-xs text-text-muted">—</span>
                      }
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {effectiveStatus !== 'verified' && (
                          <button
                            onClick={() => open('approve-store', { id: store.id })}
                            className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-500 text-[11px] font-bold hover:bg-green-500/20 transition-all uppercase tracking-wider"
                          >
                            Approve
                          </button>
                        )}
                        {effectiveStatus !== 'flagged' && (
                          <button
                            onClick={() => open('flag-store', { id: store.id })}
                            className="px-2.5 py-1 rounded-lg bg-red-400/10 text-red-400 text-[11px] font-bold hover:bg-red-400/20 transition-all uppercase tracking-wider"
                          >
                            Flag
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        dialogId="approve-store"
        title="Approve Store"
        description={`Are you sure you want to approve ${activeStore?.name}? This will grant them "Verified Retailer" status.`}
        confirmLabel="Approve Store"
        variant="primary"
        onConfirm={() => { if (activeStoreId) changeStatus(activeStoreId, 'verified'); }}
      />

      <ConfirmDialog
        dialogId="flag-store"
        title="Flag Store"
        description={`Are you sure you want to flag ${activeStore?.name}? This will mark it for review.`}
        confirmLabel="Flag Store"
        variant="danger"
        onConfirm={() => { if (activeStoreId) changeStatus(activeStoreId, 'flagged'); }}
      />
    </div>
  );
}
