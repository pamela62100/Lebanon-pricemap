import { useState } from 'react';
import { useToastStore } from '@/store/useToastStore';
import type { PriceSpike } from './PriceSpikeAlert';
import { cn } from '@/lib/utils';

interface AnomalyTableProps {
  anomalies: PriceSpike[];
  onDismiss: (id: string) => void;
  onInvestigate: (id: string) => void;
}

type SortKey = 'pctChange' | 'detectedAt' | 'productName';

export function AnomalyTable({ anomalies, onDismiss, onInvestigate }: AnomalyTableProps) {
  const [sort, setSort] = useState<SortKey>('pctChange');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const addToast = useToastStore(s => s.addToast);

  const sorted = [...anomalies].sort((a, b) => {
    if (sort === 'pctChange') return sortDir === 'desc' ? b.pctChange - a.pctChange : a.pctChange - b.pctChange;
    if (sort === 'detectedAt') return sortDir === 'desc'
      ? new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
      : new Date(a.detectedAt).getTime() - new Date(b.detectedAt).getTime();
    if (sort === 'productName') return sortDir === 'desc'
      ? b.productName.localeCompare(a.productName)
      : a.productName.localeCompare(b.productName);
    return 0;
  });

  const toggleSort = (key: SortKey) => {
    if (sort === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSort(key); setSortDir('desc'); }
  };

  const SortButton = ({ label, colKey }: { label: string; colKey: SortKey }) => (
    <button onClick={() => toggleSort(colKey)} className="flex items-center gap-1 text-xs font-bold text-text-muted uppercase tracking-wide hover:text-text-main transition-colors">
      {label}
      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
        {sort === colKey ? (sortDir === 'desc' ? 'arrow_downward' : 'arrow_upward') : 'unfold_more'}
      </span>
    </button>
  );

  return (
    <div className="rounded-xl border border-border-soft overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-soft bg-bg-muted/40">
            <th className="text-left px-5 py-3"><SortButton label="Product" colKey="productName" /></th>
            <th className="text-left px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">Store</th>
            <th className="text-right px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">Old Price</th>
            <th className="text-right px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">New Price</th>
            <th className="text-right px-5 py-3"><SortButton label="% Change" colKey="pctChange" /></th>
            <th className="text-right px-5 py-3"><SortButton label="Time" colKey="detectedAt" /></th>
            <th className="text-right px-5 py-3 text-xs font-bold text-text-muted uppercase tracking-wide">Action</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-5 py-12 text-center text-text-muted text-sm">No anomalies detected in this period.</td>
            </tr>
          ) : sorted.map(spike => {
            const severity = spike.pctChange >= 50 ? 'critical' : spike.pctChange >= 25 ? 'high' : 'moderate';
            const pctColor = severity === 'critical' ? 'text-red-400' : severity === 'high' ? 'text-amber-400' : 'text-yellow-400';
            const timeAgo = (() => {
              const diff = Date.now() - new Date(spike.detectedAt).getTime();
              const h = Math.floor(diff / 3600000);
              return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
            })();
            return (
              <tr key={spike.id} className={cn('border-b border-border-soft last:border-0 hover:bg-bg-base/50 transition-colors',
                severity === 'critical' && 'bg-red-500/3'
              )}>
                <td className="px-5 py-3 text-sm font-semibold text-text-main">{spike.productName}</td>
                <td className="px-5 py-3">
                  <p className="text-sm text-text-main">{spike.storeName}</p>
                  <p className="text-xs text-text-muted">{spike.district}</p>
                </td>
                <td className="px-5 py-3 text-right text-sm text-text-muted line-through">{spike.oldPrice.toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-sm font-bold text-text-main">{spike.newPrice.toLocaleString()}</td>
                <td className={`px-5 py-3 text-right text-sm font-black ${pctColor}`}>+{spike.pctChange.toFixed(0)}%</td>
                <td className="px-5 py-3 text-right text-xs text-text-muted">{timeAgo}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => { onInvestigate(spike.id); addToast('Flagged for review', 'info'); }} className="px-2.5 py-1 rounded-lg bg-primary text-white text-[11px] font-bold hover:opacity-90 transition-all">
                      Investigate
                    </button>
                    <button onClick={() => onDismiss(spike.id)} className="px-2.5 py-1 rounded-lg border border-border-soft text-[11px] text-text-muted hover:text-text-main transition-colors">
                      Dismiss
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
