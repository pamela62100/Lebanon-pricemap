import { useState, useMemo } from 'react';
import { getEnrichedPriceEntries } from '@/api/mockData';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';

export function BulkEditTable() {
  const user = useAuthStore(s => s.user);
  const addToast = useToastStore(s => s.addToast);

  const baseEntries = useMemo(() =>
    getEnrichedPriceEntries().filter(e => e.submittedBy === user?.id),
    [user]
  );

  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const updatePrice = (id: string, val: string) => {
    setEdits(prev => ({ ...prev, [id]: val }));
  };

  const saveRow = async (id: string) => {
    setSaving(id);
    await new Promise(r => setTimeout(r, 600));
    setSaving(null);
    setEdits(prev => { const n = { ...prev }; delete n[id]; return n; });
    addToast('Price updated — pending verification', 'success');
  };

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
          {baseEntries.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-text-muted text-sm">
                No prices submitted yet. Use the Upload or Manual entry options to add products.
              </td>
            </tr>
          ) : baseEntries.map(entry => {
            const edited = edits[entry.id] !== undefined;
            const isSaving = saving === entry.id;
            return (
              <tr key={entry.id} className={cn('border-b border-border-soft last:border-0 transition-colors', edited ? 'bg-primary/3' : 'hover:bg-bg-base/50')}>
                <td className="px-5 py-3">
                  <p className="text-sm font-semibold text-text-main">{entry.product?.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{entry.product?.unit}</p>
                </td>
                <td className="px-5 py-3 text-xs font-mono text-text-muted">{entry.product?.barcode ?? '—'}</td>
                <td className="px-5 py-3">
                  <input
                    type="text"
                    defaultValue={entry.priceLbp.toLocaleString()}
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
                  <StatusBadge status={entry.status} />
                </td>
                <td className="px-5 py-3 text-xs text-text-muted">
                  {new Date(entry.createdAt).toLocaleDateString()}
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
