import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ModerationCard, type ModerationEntry } from '@/components/admin/ModerationCard';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { discrepancyApi } from '@/api/catalog.api';
import { useToastStore } from '@/store/useToastStore';

export function AdminFlaggedPricesPage() {
  const [entries, setEntries] = useState<ModerationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { open, getParam } = useRouteDialog();
  const addToast = useToastStore(s => s.addToast);

  useEffect(() => {
    discrepancyApi.getPending().then((res) => {
      const data = res.data?.data ?? res.data;
      const raw = Array.isArray(data) ? data : [];
      const mapped: ModerationEntry[] = raw.map((r: any) => ({
        id: r.id,
        submittedBy: r.reporterTrustScore ? `Trust score: ${r.reporterTrustScore}` : 'Community Reporter',
        submittedAt: r.createdAt ?? new Date().toISOString(),
        storeName: r.store?.name ?? r.storeId,
        productName: r.product?.name ?? r.productId,
        submittedPrice: r.observedPriceLbp ?? 0,
        extractedPrice: r.catalogPriceLbp ?? 0,
        mismatch: r.observedPriceLbp != null && r.catalogPriceLbp != null && r.observedPriceLbp !== r.catalogPriceLbp,
        receiptNote: r.note,
      }));
      setEntries(mapped);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const remove = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));

  const activeId = getParam('id');
  const activeEntry = entries.find(e => e.id === activeId);

  const handleVerify = async () => {
    if (!activeId) return;
    try {
      await discrepancyApi.approve(activeId, {});
      remove(activeId);
      addToast('Price verified', 'success');
    } catch { addToast('Action failed'); }
  };

  const handleReject = async () => {
    if (!activeId) return;
    try {
      await discrepancyApi.reject(activeId, { note: 'Rejected by admin' });
      remove(activeId);
      addToast('Submission rejected', 'success');
    } catch { addToast('Action failed'); }
  };

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-main">Moderation Queue</h1>
          <p className="text-text-muted text-sm mt-1">{entries.length} submissions pending review</p>
        </div>
        {entries.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-text-muted bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-2.5">
            <span className="material-symbols-outlined text-amber-400" style={{ fontSize: '16px' }}>warning</span>
            <span className="font-semibold text-amber-400">{entries.filter(e => e.mismatch).length} mismatch{entries.filter(e => e.mismatch).length !== 1 ? 'es' : ''} flagged</span>
          </div>
        )}
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-2xl bg-bg-muted animate-pulse" />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center gap-3 bg-bg-surface rounded-2xl border border-border-soft">
          <span className="material-symbols-outlined text-green-500" style={{ fontSize: '48px' }}>check_circle</span>
          <p className="text-base font-bold text-text-main">Queue is clear!</p>
          <p className="text-sm text-text-muted">No pending moderation items.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {entries.map((entry, i) => (
            <motion.div key={entry.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <ModerationCard
                entry={entry}
                onVerify={() => open('verify-moderation', { id: entry.id })}
                onReject={() => open('reject-moderation', { id: entry.id })}
                onWarn={() => open('warn-moderation', { id: entry.id })}
              />
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        dialogId="verify-moderation"
        title="Verify Price Submission"
        description={`Confirm that the submitted price for ${activeEntry?.productName} matches the store data?`}
        confirmLabel="Verify Price"
        variant="primary"
        onConfirm={handleVerify}
      />

      <ConfirmDialog
        dialogId="reject-moderation"
        title="Reject Submission"
        description={`Reject this price submission for ${activeEntry?.productName}?`}
        confirmLabel="Reject"
        variant="warning"
        onConfirm={handleReject}
      />

      <ConfirmDialog
        dialogId="warn-moderation"
        title="Issue Warning"
        description={`Reject and issue a formal warning to ${activeEntry?.submittedBy} for incorrect data submission?`}
        confirmLabel="Warn & Reject"
        variant="danger"
        onConfirm={handleReject}
      />
    </div>
  );
}
