import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BulkEditTable } from '@/components/retailer/BulkEditTable';
import { SyncStatusCard } from '@/components/retailer/SyncStatusCard';
import { getEnrichedPriceEntries } from '@/api/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LBPInput } from '@/components/ui/LBPInput';
import { useToastStore } from '@/store/useToastStore';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { RouteDialog } from '@/components/dialogs/RouteDialog';
import { cn } from '@/lib/utils';

const STATUS_FILTERS = ['all', 'verified', 'pending', 'flagged'] as const;
type FilterType = typeof STATUS_FILTERS[number];

export function RetailerProductsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [searchQ, setSearchQ] = useState('');
  const [view, setView] = useState<'table' | 'edit'>('table');

  const { open, getParam } = useRouteDialog();
  const addToast = useToastStore(s => s.addToast);

  const allEntries = useMemo(() => getEnrichedPriceEntries(), []);

  const activeEntryId = getParam('id');
  const activeEntry = useMemo(() => allEntries.find(e => e.id === activeEntryId), [allEntries, activeEntryId]);
  const [editPrice, setEditPrice] = useState<number | ''>(activeEntry?.priceLbp ?? '');

  // Update editPrice state when activeEntry changes (e.g., dialog opens for a new item)
  useEffect(() => {
    setEditPrice(activeEntry?.priceLbp ?? '');
  }, [activeEntry]);

  const filtered = useMemo(() => {
    let res = allEntries;
    if (statusFilter !== 'all') res = res.filter(e => e.status === statusFilter);
    if (searchQ) {
      const q = searchQ.toLowerCase();
      res = res.filter(e =>
        e.product?.name.toLowerCase().includes(q) ||
        (e.product?.barcode ?? '').includes(q)
      );
    }
    return res;
  }, [allEntries, statusFilter, searchQ]);

  const counts = useMemo(() => ({
    all: allEntries.length,
    verified: allEntries.filter(e => e.status === 'verified').length,
    pending: allEntries.filter(e => e.status === 'pending').length,
    flagged: allEntries.filter(e => e.status === 'flagged').length,
  }), [allEntries]);

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main">Product Catalog</h1>
          <p className="text-text-muted mt-1 text-sm">{allEntries.length} price entries across your store</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/retailer/upload')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-soft text-sm font-bold text-text-sub hover:border-primary hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>upload_file</span>
            CSV Upload
          </button>
          <button
            onClick={() => navigate('/retailer/sync')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>api</span>
            API Sync
          </button>
        </div>
      </motion.div>

      {/* Sync status */}
      <SyncStatusCard />

      {/* Filters + search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-bg-surface border border-border-soft rounded-xl p-1">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all',
                statusFilter === f ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main'
              )}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" style={{ fontSize: '16px' }}>search</span>
          <input
            type="text"
            placeholder="Search by name or barcode…"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            className="w-full pl-8 pr-3 h-9 rounded-xl bg-bg-surface border border-border-soft text-sm text-text-main focus:outline-none focus:border-primary"
          />
        </div>
        <div className="ml-auto flex items-center gap-1 bg-bg-surface border border-border-soft rounded-xl p-1">
          {(['table', 'edit'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className={cn('px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all', view === v ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main')}>
              {v === 'table' ? 'View' : 'Bulk Edit'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {view === 'table' ? (
        <div className="bg-bg-surface rounded-2xl border border-border-soft overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-soft bg-bg-muted/30">
                {['Product', 'Category', 'Barcode', 'Price (LBP)', 'Status', 'Last Update', 'Promo', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-text-muted text-sm">No entries match your filters.</td>
                </tr>
              ) : filtered.map(entry => (
                <tr key={entry.id} className="border-b border-border-soft last:border-0 hover:bg-bg-base/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-semibold text-text-main">{entry.product?.name}</p>
                    <p className="text-xs text-text-muted">{entry.product?.unit}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-text-muted">{entry.product?.category}</td>
                  <td className="px-5 py-3 text-xs font-mono text-text-muted">{entry.product?.barcode ?? '—'}</td>
                  <td className="px-5 py-3 text-sm font-bold text-text-main">{entry.priceLbp.toLocaleString()}</td>
                  <td className="px-5 py-3"><StatusBadge status={entry.status} /></td>
                  <td className="px-5 py-3 text-xs text-text-muted">{new Date(entry.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    {entry.isPromotion
                      ? <span className="text-xs font-bold text-primary">● PROMO</span>
                      : <span className="text-xs text-text-muted">—</span>
                    }
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => {
                        setEditPrice(entry.priceLbp);
                        open('edit-price', { id: entry.id });
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary-soft/30 transition-all"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <BulkEditTable />
      )}

      {/* URL-Driven Price Edit Dialog */}
      <RouteDialog
        dialogId="edit-price"
        title="Update Retail Price"
        description={activeEntry?.product?.name}
        size="sm"
      >
        <div className="flex flex-col gap-6 py-2">
           <div className="bg-bg-muted/50 p-4 rounded-xl border border-border-soft flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-bg-surface border border-border-soft flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-text-muted">shopping_basket</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{activeEntry?.product?.category}</p>
                <p className="text-sm font-bold text-text-main truncate">{activeEntry?.product?.name}</p>
              </div>
           </div>

           <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2 text-center">Current Price: {activeEntry?.priceLbp.toLocaleString()} LBP</label>
              <LBPInput
                value={editPrice}
                onChange={val => setEditPrice(val)}
                autoFocus
              />
           </div>

           <button
             onClick={() => {
               addToast('Price updated successfully', 'success');
               // Logic to update mock data would go here
             }}
             disabled={!editPrice || editPrice === activeEntry?.priceLbp}
             className="h-11 rounded-xl bg-primary text-white font-bold text-sm shadow-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
           >
             Save New Price
           </button>
        </div>
      </RouteDialog>
    </div>
  );
}
