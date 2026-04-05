import { useState, useEffect } from 'react';
import { storesApi } from '@/api/stores.api';
import { useToastStore } from '@/store/useToastStore';

interface ApiKey {
  id: string;
  keyLabel: string;
  isActive: boolean;
  createdAt: string;
  lastUsedAt?: string;
  plainKey?: string; // only present immediately after creation
}

const CODE_SNIPPET = `curl -X POST https://api.rakis.app/v1/sync \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
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
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [showRevokeId, setShowRevokeId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const addToast = useToastStore(s => s.addToast);

  useEffect(() => {
    storesApi.getApiKeys()
      .then(res => {
        const data = (res as any).data?.data ?? [];
        setKeys(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
  }, []);

  const handleGenerate = async () => {
    setIsCreating(true);
    try {
      const res = await storesApi.createApiKey('Default');
      const created = (res as any).data?.data;
      if (created?.plainKey) {
        setNewKey(created.plainKey);
        setKeys(prev => [{ ...created }, ...prev]);
        addToast('API key generated. Copy it now — it won\'t be shown again.', 'success');
      }
    } catch {
      addToast('Failed to generate API key', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await storesApi.revokeApiKey(id);
      setKeys(prev => prev.filter(k => k.id !== id));
      setShowRevokeId(null);
      addToast('API key revoked', 'info');
    } catch {
      addToast('Failed to revoke key', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* New key banner */}
      {newKey && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex flex-col gap-2">
          <p className="text-xs font-bold text-green-700">Your new API key — copy it now, it won't be shown again:</p>
          <div className="flex items-center gap-2 bg-bg-base rounded-xl border border-green-500/20 p-3">
            <code className="flex-1 text-xs font-mono text-text-main break-all">{newKey}</code>
            <button
              onClick={() => { navigator.clipboard.writeText(newKey).catch(() => {}); addToast('Copied!', 'success'); }}
              className="shrink-0 w-8 h-8 rounded-lg bg-bg-muted flex items-center justify-center hover:bg-border-soft"
            >
              <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '16px' }}>content_copy</span>
            </button>
          </div>
          <button onClick={() => setNewKey(null)} className="text-xs text-text-muted hover:text-text-sub self-end">Dismiss</button>
        </div>
      )}

      {/* Key list */}
      {keys.length === 0 ? (
        <div className="bg-bg-muted rounded-2xl border border-dashed border-border-soft p-8 flex flex-col items-center gap-3 text-center">
          <span className="material-symbols-outlined text-3xl text-text-muted/40">key</span>
          <p className="text-sm font-medium text-text-muted">No API keys yet.</p>
          <button
            onClick={handleGenerate}
            disabled={isCreating}
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all disabled:opacity-60"
          >
            {isCreating ? 'Generating...' : 'Generate API Key'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {keys.map(key => (
            <div key={key.id} className="bg-bg-muted rounded-2xl border border-border-soft p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-text-main">{key.keyLabel}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Created {new Date(key.createdAt).toLocaleDateString()}
                    {key.lastUsedAt && ` · Last used ${new Date(key.lastUsedAt).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Active
                  </div>
                  <button
                    onClick={() => setShowRevokeId(key.id)}
                    className="text-xs text-red-400 hover:text-red-500 font-semibold"
                  >
                    Revoke
                  </button>
                </div>
              </div>
              {showRevokeId === key.id && (
                <div className="bg-red-400/5 border border-red-400/20 rounded-xl p-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-text-main">This will break all POS integrations immediately. Sure?</p>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setShowRevokeId(null)} className="px-3 py-1.5 rounded-lg border border-border-soft text-xs text-text-sub hover:text-text-main">Cancel</button>
                    <button onClick={() => handleRevoke(key.id)} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:opacity-90">Revoke</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={handleGenerate}
            disabled={isCreating}
            className="h-10 rounded-xl border border-dashed border-border-soft text-sm text-text-muted hover:text-text-main hover:border-border-primary transition-all disabled:opacity-60"
          >
            {isCreating ? 'Generating...' : '+ Generate New Key'}
          </button>
        </div>
      )}

      {/* Code snippet */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-text-main">Integration Example</p>
        <div className="bg-bg-base rounded-xl border border-border-soft overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-soft bg-bg-muted/50">
            <p className="text-xs font-mono text-text-muted">POST /v1/sync</p>
            <button
              onClick={() => { navigator.clipboard.writeText(CODE_SNIPPET).catch(() => {}); addToast('Code snippet copied!', 'success'); }}
              className="text-xs text-text-muted hover:text-primary transition-colors flex items-center gap-1"
            >
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
