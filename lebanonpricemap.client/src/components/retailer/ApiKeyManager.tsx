import { useState } from 'react';
import { useToastStore } from '@/store/useToastStore';

const MOCK_API_KEY = 'rk_live_••••••••••••••••••••••••••••••••';

const CODE_SNIPPET = `curl -X POST https://api.rakis.app/v1/sync \\
  -H "Authorization: Bearer ${MOCK_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prices": [
      {
        "barcode": "6221012345001",
        "product_name": "Whole Milk TL 1L",
        "price_lbp": 128000,
        "unit": "1L"
      }
    ]
  }'`;

export function ApiKeyManager() {
  const [revealed, setRevealed] = useState(false);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const addToast = useToastStore(s => s.addToast);

  const displayKey = revealed ? MOCK_API_KEY : `rk_live_${'•'.repeat(32)}`;

  const copy = async () => {
    await navigator.clipboard.writeText(MOCK_API_KEY).catch(() => {});
    addToast('API key copied to clipboard', 'success');
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Key display */}
      <div className="bg-bg-muted rounded-2xl border border-border-soft p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-text-main">Your API Key</p>
          <div className="flex items-center gap-2 text-xs font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Active
          </div>
        </div>
        <div className="flex items-center gap-3 bg-bg-base rounded-xl border border-border-soft p-3">
          <code className="flex-1 text-xs font-mono text-text-main tracking-wide break-all">{displayKey}</code>
          <button onClick={() => setRevealed(v => !v)} className="shrink-0 w-8 h-8 rounded-lg bg-bg-muted flex items-center justify-center hover:bg-border-soft transition-colors">
            <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '16px' }}>{revealed ? 'visibility_off' : 'visibility'}</span>
          </button>
          <button onClick={copy} className="shrink-0 w-8 h-8 rounded-lg bg-bg-muted flex items-center justify-center hover:bg-border-soft transition-colors">
            <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '16px' }}>content_copy</span>
          </button>
        </div>
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Created: March 1, 2025</span>
          <button
            onClick={() => setShowRevokeConfirm(true)}
            className="text-red-400 hover:text-red-500 font-semibold transition-colors"
          >
            Revoke Key
          </button>
        </div>
      </div>

      {/* Revoke confirm */}
      {showRevokeConfirm && (
        <div className="bg-red-400/5 border border-red-400/20 rounded-xl p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-text-main">This will break all POS integrations immediately. Are you sure?</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setShowRevokeConfirm(false)} className="px-3 py-1.5 rounded-lg border border-border-soft text-xs text-text-sub hover:text-text-main transition-colors">Cancel</button>
            <button onClick={() => { setShowRevokeConfirm(false); addToast('API key revoked. Generate a new one.', 'error'); }} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:opacity-90">Revoke</button>
          </div>
        </div>
      )}

      {/* Code snippet */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-text-main">Integration Example</p>
        <div className="bg-bg-base rounded-xl border border-border-soft overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-soft bg-bg-muted/50">
            <p className="text-xs font-mono text-text-muted">POST /v1/sync</p>
            <button onClick={() => { navigator.clipboard.writeText(CODE_SNIPPET).catch(() => {}); addToast('Code snippet copied!', 'success'); }} className="text-xs text-text-muted hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>content_copy</span>
              Copy
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-text-main overflow-x-auto">{CODE_SNIPPET}</pre>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-text-muted leading-relaxed">
        <strong className="text-text-main">Rate limit:</strong> 1,000 requests/day · Max 500 products per request · Prices are reviewed within 2 hours of submission.
      </div>
    </div>
  );
}
