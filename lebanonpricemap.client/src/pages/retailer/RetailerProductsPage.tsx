import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BulkEditTable } from '@/components/retailer/BulkEditTable';
import { SyncStatusCard } from '@/components/retailer/SyncStatusCard';
import { storesApi } from '@/api/stores.api';
import { catalogApi } from '@/api/catalog.api';
import { productsApi } from '@/api/products.api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LBPInput } from '@/components/ui/LBPInput';
import { useToastStore } from '@/store/useToastStore';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { RouteDialog } from '@/components/dialogs/RouteDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { cn } from '@/lib/utils';

const STATUS_FILTERS = ['all', 'verified', 'pending', 'flagged'] as const;
type FilterType = typeof STATUS_FILTERS[number];

interface CatalogEntry {
  id: string;
  productId: string;
  officialPriceLbp: number;
  isInStock: boolean;
  isPromotion: boolean;
  updatedAt?: string;
  product?: { name: string; category?: string; unit?: string; barcode?: string };
}

export function RetailerProductsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [searchQ, setSearchQ] = useState('');
  const [view, setView] = useState<'table' | 'edit'>('table');
  const [allEntries, setAllEntries] = useState<CatalogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);

  // Add-product dialog state
  const [allProducts, setAllProducts] = useState<{ id: string; name: string; category?: string; unit?: string }[]>([]);
  const [addSearch, setAddSearch] = useState('');
  const [addProductId, setAddProductId] = useState<string>('');
  const [addPrice, setAddPrice] = useState<number | ''>('');

  const { open, close, getParam } = useRouteDialog();
  const addToast = useToastStore(s => s.addToast);

  const activeEntryId = getParam('id');
  const activeEntry = allEntries.find(e => e.id === activeEntryId);
  const [editPrice, setEditPrice] = useState<number | ''>(activeEntry?.officialPriceLbp ?? '');

  useEffect(() => {
    setEditPrice(activeEntry?.officialPriceLbp ?? '');
  }, [activeEntry]);

  useEffect(() => {
    storesApi.getMine().then(async (res) => {
      const store = res.data?.data ?? res.data;
      if (store?.id) {
        setStoreId(store.id);
        const catRes = await catalogApi.getByStore(store.id);
        const data = catRes.data?.data ?? catRes.data;
        setAllEntries(Array.isArray(data) ? data : []);
      }
    }).catch(() => {}).finally(() => setIsLoading(false));

    productsApi.getAll().then((res) => {
      const data = (res as any).data?.data ?? (res as any).data;
      setAllProducts(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, []);

  const addProductToCatalog = async () => {
    if (!storeId || !addProductId || !addPrice) return;
    try {
      const res = await catalogApi.create({
        storeId,
        productId: addProductId,
        officialPriceLbp: Number(addPrice),
        isInStock: true,
      });
      const created = (res as any).data?.data;
      if (created) {
        const product = allProducts.find(p => p.id === addProductId);
        setAllEntries(prev => [{ ...created, product }, ...prev]);
      }
      setAddProductId('');
      setAddPrice('');
      setAddSearch('');
      addToast('Product added to your catalog', 'success');
      close();
    } catch {
      addToast('Failed to add product', 'error');
    }
  };

  const availableProducts = allProducts.filter(p => {
    if (allEntries.some(e => e.productId === p.id)) return false;
    if (!addSearch) return true;
    return p.name.toLowerCase().includes(addSearch.toLowerCase());
  });

  const filtered = useMemo(() => {
    let res = allEntries;
    if (statusFilter !== 'all') {
      res = res.filter(e => {
        if (statusFilter === 'verified') return e.isInStock;
        if (statusFilter === 'pending') return !e.isInStock;
        return true;
      });
    }
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
    verified: allEntries.filter(e => e.isInStock).length,
    pending: allEntries.filter(e => !e.isInStock).length,
    flagged: 0,
  }), [allEntries]);

  const savePrice = async () => {
    if (!activeEntryId || !editPrice) return;
    try {
      await catalogApi.update(activeEntryId, { officialPriceLbp: Number(editPrice) });
      setAllEntries(prev => prev.map(e =>
        e.id === activeEntryId ? { ...e, officialPriceLbp: Number(editPrice) } : e
      ));
      addToast('Price updated successfully', 'success');
    } catch {
      addToast('Failed to update price', 'error');
    }
  };

  const deleteCatalogItem = async () => {
    if (!activeEntryId) return;
    try {
      await catalogApi.delete(activeEntryId);
      setAllEntries(prev => prev.filter(e => e.id !== activeEntryId));
      addToast('Product removed from catalog', 'info');
    } catch {
      addToast('Failed to remove product', 'error');
    }
  };

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
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-soft text-sm font-semibold text-text-sub hover:border-primary hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>upload_file</span>
            CSV Upload
          </button>
          <button
            onClick={() => open('add-catalog-product')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Add product
          </button>
        </div>
      </motion.div>

      <SyncStatusCard />

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

      {view === 'table' ? (
        <div className="bg-bg-surface rounded-2xl border border-border-soft overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-12 rounded-xl bg-bg-muted animate-pulse" />)}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-soft bg-bg-muted/30">
                  {['Product', 'Category', 'Barcode', 'Price (LBP)', 'Stock', 'Last Update', 'Promo', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-text-muted text-sm">No entries match your filters.</td>
                  </tr>
                ) : filtered.map(entry => (
                  <tr key={entry.id} className="border-b border-border-soft last:border-0 hover:bg-bg-base/50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm font-semibold text-text-main">{entry.product?.name ?? entry.productId}</p>
                      <p className="text-xs text-text-muted">{entry.product?.unit}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-text-muted">{entry.product?.category ?? '—'}</td>
                    <td className="px-5 py-3 text-xs font-mono text-text-muted">{entry.product?.barcode ?? '—'}</td>
                    <td className="px-5 py-3 text-sm font-bold text-text-main">{entry.officialPriceLbp.toLocaleString()}</td>
                    <td className="px-5 py-3"><StatusBadge status={entry.isInStock ? 'verified' : 'flagged'} /></td>
                    <td className="px-5 py-3 text-xs text-text-muted">
                      {entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3">
                      {entry.isPromotion
                        ? <span className="text-xs font-bold text-primary">● PROMO</span>
                        : <span className="text-xs text-text-muted">—</span>
                      }
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditPrice(entry.officialPriceLbp);
                            open('edit-price', { id: entry.id });
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary-soft/30 transition-all"
                          title="Edit price"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                        </button>
                        <button
                          onClick={() => open('delete-catalog-item', { id: entry.id })}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Remove from catalog"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <BulkEditTable />
      )}

      <RouteDialog dialogId="add-catalog-product" title="Add product to your catalog" description="Pick a product from the master list and set your store's price.">
        <div className="flex flex-col gap-4 py-2">
          <div>
            <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">Search products</label>
            <input
              type="text"
              value={addSearch}
              onChange={(e) => setAddSearch(e.target.value)}
              placeholder="e.g. Olive oil, milk, bread..."
              className="w-full h-11 bg-bg-muted border border-border-soft rounded-xl px-4 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div className="max-h-56 overflow-y-auto border border-border-soft rounded-xl divide-y divide-border-soft">
            {availableProducts.length === 0 ? (
              <p className="p-4 text-sm text-text-muted text-center">No matching products available.</p>
            ) : availableProducts.slice(0, 20).map(p => (
              <button
                key={p.id}
                onClick={() => setAddProductId(p.id)}
                className={cn(
                  'w-full text-left px-4 py-2.5 text-sm transition-colors',
                  addProductId === p.id ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-bg-base'
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{p.name}</span>
                  {p.category && <span className="text-[10px] text-text-muted">{p.category}</span>}
                </div>
              </button>
            ))}
          </div>
          {addProductId && (
            <div>
              <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">Your price (LBP)</label>
              <LBPInput value={addPrice} onChange={(val) => setAddPrice(val)} autoFocus />
            </div>
          )}
          <button
            onClick={addProductToCatalog}
            disabled={!addProductId || !addPrice}
            className="h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Add to catalog
          </button>
        </div>
      </RouteDialog>

      <RouteDialog dialogId="edit-price" title="Update Retail Price" description={activeEntry?.product?.name} size="sm">
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
            <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2 text-center">
              Current Price: {activeEntry?.officialPriceLbp.toLocaleString()} LBP
            </label>
            <LBPInput value={editPrice} onChange={val => setEditPrice(val)} autoFocus />
          </div>
          <button
            onClick={savePrice}
            disabled={!editPrice || editPrice === activeEntry?.officialPriceLbp}
            className="h-11 rounded-xl bg-primary text-white font-bold text-sm shadow-card hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Save New Price
          </button>
        </div>
      </RouteDialog>

      <ConfirmDialog
        dialogId="delete-catalog-item"
        title="Remove from your catalog?"
        description={`This will remove "${activeEntry?.product?.name ?? 'this product'}" from your store. Customers won't see it anymore.`}
        confirmLabel="Remove"
        variant="danger"
        onConfirm={deleteCatalogItem}
      />
    </div>
  );
}
