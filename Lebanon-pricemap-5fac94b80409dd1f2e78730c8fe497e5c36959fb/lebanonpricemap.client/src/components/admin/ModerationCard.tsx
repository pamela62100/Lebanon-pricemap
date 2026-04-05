import { useState } from 'react';
import { useToastStore } from '@/store/useToastStore';

export interface ModerationEntry {
  id: string;
  submittedBy: string;
  submittedAt: string;
  storeName: string;
  productName: string;
  submittedPrice: number;
  receiptNote?: string;
  extractedPrice?: number;
  mismatch: boolean;
}

interface ModerationCardProps {
  entry: ModerationEntry;
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
  onWarn: (id: string) => void;
}

export function ModerationCard({ entry, onVerify, onReject, onWarn }: ModerationCardProps) {
  // We no longer need internal 'acting' state as it's handled by the ConfirmDialogs in the parent
  
  const timeAgo = (() => {
    const diff = Date.now() - new Date(entry.submittedAt).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return 'Just now';
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  })();

  return (
    <div className="bg-bg-surface rounded-2xl border border-border-soft overflow-hidden">
      {entry.mismatch && (
        <div className="px-5 py-2.5 bg-amber-400/10 border-b border-amber-400/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400" style={{ fontSize: '16px' }}>warning</span>
          <span className="text-xs font-bold text-amber-400">Price mismatch detected — submitted vs extracted differ</span>
        </div>
      )}
      <div className="grid grid-cols-2 divide-x divide-border-soft">
        {/* Left: Submitted data */}
        <div className="p-5">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wide mb-3">Submitted by Community</p>
          <div className="w-full aspect-video bg-bg-muted rounded-xl border border-border-soft flex items-center justify-center mb-4">
            <div className="text-center">
              <span className="material-symbols-outlined text-text-muted mb-1" style={{ fontSize: '36px' }}>receipt_long</span>
              <p className="text-xs text-text-muted">Receipt image</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Submitted by', value: entry.submittedBy },
              { label: 'Store',        value: entry.storeName },
              { label: 'Product',      value: entry.productName },
              { label: 'Price (LBP)',  value: entry.submittedPrice.toLocaleString() },
              { label: 'Submitted',    value: timeAgo },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-xs text-text-muted">{row.label}</span>
                <span className="text-xs font-semibold text-text-main">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Extracted / parsed data */}
        <div className="p-5">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wide mb-3">OCR Extracted Data</p>
          <div className="flex flex-col gap-2 mt-2">
            {[
              { label: 'Store matched', value: entry.storeName, match: true },
              { label: 'Product',       value: entry.productName, match: !entry.mismatch },
              { label: 'Price (LBP)',   value: (entry.extractedPrice ?? entry.submittedPrice).toLocaleString(), match: !entry.mismatch },
            ].map(row => (
              <div key={row.label} className={`flex items-center justify-between p-2 rounded-lg ${!row.match ? 'bg-red-500/5 border border-red-500/15' : ''}`}>
                <span className="text-xs text-text-muted">{row.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-semibold ${!row.match ? 'text-red-400' : 'text-text-main'}`}>{row.value}</span>
                  {!row.match && <span className="material-symbols-outlined text-red-400" style={{ fontSize: '12px' }}>warning</span>}
                </div>
              </div>
            ))}
            {entry.receiptNote && (
              <div className="mt-3 p-3 bg-bg-base rounded-lg border border-border-soft">
                <p className="text-xs text-text-muted leading-relaxed">{entry.receiptNote}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 border-t border-border-soft flex items-center justify-end gap-2">
        <button onClick={() => onWarn(entry.id)} className="px-4 py-2 rounded-xl border border-amber-400/30 text-amber-400 text-xs font-bold hover:bg-amber-400/5 transition-all">
          Warn User
        </button>
        <button onClick={() => onReject(entry.id)} className="px-4 py-2 rounded-xl border border-red-400/30 text-red-400 text-xs font-bold hover:bg-red-400/5 transition-all">
          Reject
        </button>
        <button onClick={() => onVerify(entry.id)} className="px-4 py-2 rounded-xl bg-green-500 text-white text-xs font-bold hover:opacity-90 transition-all">
          ✓ Verify Price
        </button>
      </div>
    </div>
  );
}
