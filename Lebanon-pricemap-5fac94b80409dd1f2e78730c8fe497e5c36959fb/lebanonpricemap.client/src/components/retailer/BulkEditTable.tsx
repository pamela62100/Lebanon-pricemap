import { useState, useEffect } from 'react';
import { useToastStore } from '@/store/useToastStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { storesApi } from '@/api/stores.api';
import { catalogApi } from '@/api/catalog.api';
import { cn } from '@/lib/utils';

interface CatalogEntry {
  id: string;
  productId: string;
  officialPriceLbp: number;
  isInStock: boolean;
  updatedAt?: string;
  product?: { name: string; unit?: string; barcode?: string };
}

export function BulkEditTable() {
  const addToast = useToastStore(s => s.addToast);
  const [entries, setEntries] = useState<CatalogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    storesApi.getMine().then(async (res) => {
      const store = res.data?.data ?? res.data;
      if (store?.id) {
        const catRes = await catalogApi.getByStore(store.id);
        const data = catRes.data?.data ?? catRes.data;
        setEntries(Array.isArray(data) ? data : []);
      }
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const updatePrice = (id: string, val: string) => {
    setEdits(prev => ({ ...prev, [id]: val }));
  };

  const saveRow = async (id: string) => {
    const newPrice = Number(edits[id]?.replace(/,/g, ''));
    if (!newPrice) return;
    setSaving(id);
    try {
      await catalogApi.update(id, { officialPriceLbp: newPrice });
      setEntries(prev => prev.map(e => e.id === id ? { ...e, officialPriceLbp: newPrice } : e));
      setEdits(prev => { const n = { ...prev }; delete n[id]; return n; });
      addToast('Price updated', 'success');
    } catch {
      addToast('Failed to update price');
    } finally {
      setSaving(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border-soft p-6 space-y-3">
        {[1, 2, 3].map(i => <div key={i} className="h-12 rounded-xl bg-bg-muted animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border-soft overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-soft bg-bg-muted/50">
            {['Product', 'Barcode', 'Price LBP', 'Status', 'Last Updated', ''].map(h => (
              <th key={h} className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-text-muted text-sm">
                No prices submitted yet. Use the Upload or Manual entry options to add products.
              </td>
            </tr>
          ) : entries.map(entry => {
            const edited = edits[entry.id] !== undefined;
            const isSaving = saving === entry.id;
            return (
              <tr key={entry.id} className={cn('border-b border-border-soft last:border-0 transition-colors', edited ? 'bg-primary/3' : 'hover:bg-bg-base/50')}>
                <td className="px-5 py-3">
                  <p className="text-sm font-semibold text-text-main">{entry.product?.name ?? entry.productId}</p>
                  <p className="text-xs text-text-muted mt-0.5">{entry.product?.unit}</p>
                </td>
                <td className="px-5 py-3 text-xs font-mono text-text-muted">{entry.product?.barcode ?? '—'}</td>
                <td className="px-5 py-3">
                  <input
                    type="text"
                    defaultValue={entry.officialPriceLbp.toLocaleString()}
                    value={edited ? edits[entry.id] : undefined}
                    onChange={e => updatePrice(entry.id, e.target.value)}
                    className={cn('w-32 px-2 py-1 font-mono text-sm rounded-lg border focus:outline-none transition-colors',
                      edited
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border-soft bg-bg-muted text-text-main focus:border-primary'
                    )}
                  />
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={entry.isInStock ? 'verified' : 'flagged'} />
                </td>
                <td className="px-5 py-3 text-xs text-text-muted">
                  {entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString() : '—'}
                </td>
                <td className="px-5 py-3 text-right">
                  {edited && (
                    <button
                      onClick={() => saveRow(entry.id)}
                      disabled={isSaving}
                      className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                      {isSaving ? 'Saving…' : 'Save'}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
