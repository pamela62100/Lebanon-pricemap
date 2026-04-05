import { useToastStore } from '@/store/useToastStore';

export interface PriceSpike {
  id: string;
  productName: string;
  storeName: string;
  district: string;
  oldPrice: number;
  newPrice: number;
  pctChange: number;
  detectedAt: string;
}

interface PriceSpikeAlertProps {
  spike: PriceSpike;
  onInvestigate?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export function PriceSpikeAlert({ spike, onInvestigate, onDismiss }: PriceSpikeAlertProps) {
  const addToast = useToastStore(s => s.addToast);

  const severity = spike.pctChange >= 50 ? 'critical' : spike.pctChange >= 25 ? 'high' : 'moderate';
  const colors = {
    critical: { bg: 'bg-red-500/10', border: 'border-red-500/25', text: 'text-red-400', badge: 'bg-red-500/15 text-red-400 border-red-400/20' },
    high:     { bg: 'bg-amber-400/8', border: 'border-amber-400/25', text: 'text-amber-400', badge: 'bg-amber-400/15 text-amber-400 border-amber-400/20' },
    moderate: { bg: 'bg-yellow-500/6', border: 'border-yellow-500/20', text: 'text-yellow-400', badge: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' },
  }[severity];

  const timeAgo = (() => {
    const diff = Date.now() - new Date(spike.detectedAt).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    return `${Math.floor(m / 60)}h ago`;
  })();

  return (
    <div className={`p-5 rounded-2xl border ${colors.bg} ${colors.border} flex items-start gap-4`}>
      <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0 border ${colors.border}`}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }} color="inherit">trending_up</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="text-sm font-bold text-text-main">{spike.productName}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.badge} uppercase`}>
            {severity} · +{spike.pctChange.toFixed(0)}%
          </span>
        </div>
        <p className="text-xs text-text-muted">{spike.storeName} · {spike.district}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-text-muted line-through">LBP {spike.oldPrice.toLocaleString()}</span>
          <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '14px' }}>arrow_forward</span>
          <span className={`text-sm font-black ${colors.text}`}>LBP {spike.newPrice.toLocaleString()}</span>
          <span className="text-xs text-text-muted">· {timeAgo}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <button
          onClick={() => { onInvestigate?.(spike.id); addToast('Flagged for investigation', 'info'); }}
          className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:opacity-90 transition-all"
        >
          Investigate
        </button>
        <button
          onClick={() => { onDismiss?.(spike.id); }}
          className="px-3 py-1.5 rounded-lg border border-border-soft text-xs text-text-muted hover:text-text-main transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
