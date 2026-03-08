import { useState } from 'react';
import { motion } from 'framer-motion';
import { ModerationCard, type ModerationEntry } from '@/components/admin/ModerationCard';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';

const MOCK_ENTRIES: ModerationEntry[] = [
  {
    id: 'm1',
    submittedBy: 'Fouad G.',
    submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    storeName: 'Carrefour Dora',
    productName: 'Eggs 30 Pack',
    submittedPrice: 420000,
    extractedPrice: 480000,
    mismatch: true,
    receiptNote: 'Receipt shows a different barcode — might be a different package size.',
  },
  {
    id: 'm2',
    submittedBy: 'Layla K.',
    submittedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    storeName: 'Bou Khalil Hamra',
    productName: 'Diesel Fuel per Liter',
    submittedPrice: 108000,
    extractedPrice: 108000,
    mismatch: false,
  },
  {
    id: 'm3',
    submittedBy: 'Rima K.',
    submittedAt: new Date(Date.now() - 10 * 3600000).toISOString(),
    storeName: 'Happy Supermarket Mar Mkhael',
    productName: 'Olive Oil 750ml',
    submittedPrice: 320000,
    extractedPrice: 320000,
    mismatch: false,
  },
];

export function AdminFlaggedPricesPage() {
  const [entries, setEntries] = useState(MOCK_ENTRIES);
  const { open, getParam } = useRouteDialog();

  const remove = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));
  
  const activeId = getParam('id');
  const activeEntry = entries.find(e => e.id === activeId);

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

      {entries.length === 0 ? (
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

      {/* URL-Driven Moderation Dialogs */}
      <ConfirmDialog
        dialogId="verify-moderation"
        title="Verify Price Submission"
        description={`Confirm that the submitted price for ${activeEntry?.productName} matches the receipt and store data?`}
        confirmLabel="Verify Price"
        variant="primary"
        onConfirm={() => activeId && remove(activeId)}
      />

      <ConfirmDialog
        dialogId="reject-moderation"
        title="Reject Submission"
        description={`Reject this price submission for ${activeEntry?.productName}? This will notify the user but provide no penalty.`}
        confirmLabel="Reject"
        variant="warning"
        onConfirm={() => activeId && remove(activeId)}
      />

      <ConfirmDialog
        dialogId="warn-moderation"
        title="Issue Warning"
        description={`Reject and issue a formal warning to ${activeEntry?.submittedBy} for incorrect data submission?`}
        confirmLabel="Warn & Reject"
        variant="danger"
        onConfirm={() => activeId && remove(activeId)}
      />
    </div>
  );
}
