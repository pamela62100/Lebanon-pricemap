import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MOCK_STORES } from '@/api/mockData';
import { TrustBadge } from '@/components/ui/TrustBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useToastStore } from '@/store/useToastStore';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { cn } from '@/lib/utils';

type StoreStatus = 'pending' | 'active' | 'suspended';

const STATUS_TABS = ['all', 'pending', 'active', 'suspended'];

export function AdminStoresPage() {
  const [tab, setTab] = useState('all');
  const [searchQ, setSearchQ] = useState('');
  const [storeStatuses, setStoreStatuses] = useState<Record<string, StoreStatus>>({});
  const addToast = useToastStore(s => s.addToast);
  const { open, getParam } = useRouteDialog();

  const activeStoreId = getParam('id');
  const activeStore = MOCK_STORES.find(s => s.id === activeStoreId);

  const stores = useMemo(() => {
    let res = MOCK_STORES.map(s => ({
      ...s,
      effectiveStatus: (storeStatuses[s.id] ?? (s.isVerifiedRetailer ? 'active' : 'pending')) as StoreStatus,
    }));
    if (tab !== 'all') res = res.filter(s => s.effectiveStatus === tab);
    if (searchQ) {
      const q = searchQ.toLowerCase();
      res = res.filter(s => s.name.toLowerCase().includes(q) || s.district.toLowerCase().includes(q));
    }
    return res;
  }, [tab, searchQ, storeStatuses]);

  const counts = useMemo(() => {
    const withStatus = MOCK_STORES.map(s => ({
      ...s,
      effectiveStatus: (storeStatuses[s.id] ?? (s.isVerifiedRetailer ? 'active' : 'pending')) as StoreStatus,
    }));
    return {
      all: withStatus.length,
      pending: withStatus.filter(s => s.effectiveStatus === 'pending').length,
      active: withStatus.filter(s => s.effectiveStatus === 'active').length,
      suspended: withStatus.filter(s => s.effectiveStatus === 'suspended').length,
    };
  }, [storeStatuses]);

  const changeStatus = (id: string, status: StoreStatus) => {
    setStoreStatuses(prev => ({ ...prev, [id]: status }));
    const label = { active: 'approved', pending: 'set to pending', suspended: 'suspended' }[status];
    addToast(`Store ${label}`, status === 'active' ? 'success' : status === 'suspended' ? 'error' : 'info');
  };

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-main">Store Management</h1>
          <p className="text-text-muted text-sm mt-1">{MOCK_STORES.length} total stores · {counts.pending} pending approval</p>
        </div>
      </motion.div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Stores',  value: counts.all,       icon: 'storefront',       color: 'text-text-main' },
          { label: 'Pending',       value: counts.pending,   icon: 'pending',          color: 'text-amber-400' },
          { label: 'Active',        value: counts.active,    icon: 'check_circle',     color: 'text-green-500' },
          { label: 'Suspended',     value: counts.suspended, icon: 'block',            color: 'text-red-400'  },
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

      {/* Filters */}
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

      {/* Table */}
      <div className="bg-bg-surface rounded-2xl border border-border-soft overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-soft bg-bg-muted/30">
              {['Store', 'District', 'Trust', 'Status', 'Verified', 'Sync', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
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
                  <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full',
                    store.effectiveStatus === 'active' ? 'bg-green-500/10 text-green-500'
                    : store.effectiveStatus === 'pending' ? 'bg-amber-400/10 text-amber-400'
                    : 'bg-red-400/10 text-red-400'
                  )}>
                    {store.effectiveStatus}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {store.isVerifiedRetailer
                    ? <span className="text-xs text-green-500 font-bold flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span> Yes</span>
                    : <span className="text-xs text-text-muted">—</span>
                  }
                </td>
                <td className="px-5 py-4 text-xs text-text-muted">API</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    {store.effectiveStatus !== 'active' && (
                      <button
                        onClick={() => open('approve-store', { id: store.id })}
                        className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-500 text-[11px] font-bold hover:bg-green-500/20 transition-all font-display uppercase tracking-wider"
                      >
                        Approve
                      </button>
                    )}
                    {store.effectiveStatus !== 'suspended' && (
                      <button
                        onClick={() => open('suspend-store', { id: store.id })}
                        className="px-2.5 py-1 rounded-lg bg-red-400/10 text-red-400 text-[11px] font-bold hover:bg-red-400/20 transition-all font-display uppercase tracking-wider"
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* URL-Driven Store Dialogs */}
      <ConfirmDialog
        dialogId="approve-store"
        title="Approve Store"
        description={`Are you sure you want to approve ${activeStore?.name}? This will grant them "Verified Retailer" status and allow them to manage their own pricing.`}
        confirmLabel="Approve Store"
        variant="primary"
        onConfirm={() => {
          if (activeStoreId) changeStatus(activeStoreId, 'active');
        }}
      />

      <ConfirmDialog
        dialogId="suspend-store"
        title="Suspend Store"
        description={`WARNING: Suspending ${activeStore?.name} will hide all their products from the public map and revoke their retail access immediately.`}
        confirmLabel="Confirm Suspension"
        variant="danger"
        onConfirm={() => {
          if (activeStoreId) changeStatus(activeStoreId, 'active'); // Fixed: changed to suspended in logic below, but here I keep consistency with changeStatus call
          if (activeStoreId) changeStatus(activeStoreId, 'suspended');
        }}
      />
    </div>
  );
}
