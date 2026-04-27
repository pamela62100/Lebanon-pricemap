import { useState, useEffect } from 'react';
import { storesApi } from '@/api/stores.api';
import { useToastStore } from '@/store/useToastStore';

interface ApiKey {
  id: string;
  keyLabel: string;
  isActive: boolean;
  createdAt: string;
  lastUsedAt?: string;
  plainKey?: string;
}

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
        addToast('Connection key created. Copy it before closing.', 'success');
      }
    } catch {
      addToast('Failed to create connection key', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await storesApi.revokeApiKey(id);
      setKeys(prev => prev.filter(k => k.id !== id));
      setShowRevokeId(null);
      addToast('Connection key removed', 'info');
    } catch {
      addToast('Failed to remove key', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {newKey && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col gap-2">
          <p className="text-xs font-semibold text-green-800">
            Copy your connection key now — it won't be shown again.
          </p>
          <div className="flex items-center gap-2 bg-white rounded-lg border border-green-200 px-3 py-2">
            <code className="flex-1 text-xs font-mono text-text-main break-all select-all">{newKey}</code>
            <button
              onClick={() => { navigator.clipboard.writeText(newKey).catch(() => {}); addToast('Copied!', 'success'); }}
              className="shrink-0 w-8 h-8 rounded-lg bg-bg-muted flex items-center justify-center hover:bg-border-soft transition-colors"
            >
              <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '16px' }}>content_copy</span>
            </button>
          </div>
          <button onClick={() => setNewKey(null)} className="text-xs text-text-muted hover:text-text-main self-end">
            I've saved it
          </button>
        </div>
      )}

      {keys.length === 0 ? (
        <div className="bg-bg-muted rounded-xl border border-dashed border-border-soft p-6 flex flex-col items-center gap-3 text-center">
          <span className="material-symbols-outlined text-3xl text-text-muted/40">key</span>
          <p className="text-sm text-text-muted">No connection key yet.</p>
          <button
            onClick={handleGenerate}
            disabled={isCreating}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
          >
            {isCreating ? 'Creating...' : 'Create connection key'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {keys.map(key => (
            <div key={key.id} className="bg-bg-muted rounded-xl border border-border-soft p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-text-main">{key.keyLabel}</p>
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    Created {new Date(key.createdAt).toLocaleDateString()}
                    {key.lastUsedAt && ` · Last used ${new Date(key.lastUsedAt).toLocaleDateString()}`}
                  </p>
                </div>
                <button
                  onClick={() => setShowRevokeId(key.id)}
                  className="text-xs text-red-500 hover:text-red-600 font-medium"
                >
                  Remove
                </button>
              </div>
              {showRevokeId === key.id && (
                <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-text-main">Removing this key will disconnect any linked system. Continue?</p>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setShowRevokeId(null)} className="px-3 py-1.5 rounded-lg border border-border-soft text-xs text-text-muted hover:text-text-main">Cancel</button>
                    <button onClick={() => handleRevoke(key.id)} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:opacity-90">Remove</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={handleGenerate}
            disabled={isCreating}
            className="h-10 rounded-lg border border-dashed border-border-soft text-sm text-text-muted hover:text-text-main hover:border-border-primary transition-all disabled:opacity-60"
          >
            {isCreating ? 'Creating...' : '+ Create new key'}
          </button>
        </div>
      )}
    </div>
  );
}
