import { motion } from 'framer-motion';
import { TrustBadge } from '@/components/ui/TrustBadge';
import { useAuthStore } from '@/store/useAuthStore';
import { cn, formatLBP } from '@/lib/utils';
import { MOCK_PRODUCTS, getEnrichedPriceEntries } from '@/api/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { RouteDialog } from '@/components/dialogs/RouteDialog';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { useMemo, useState } from 'react';

export function ProfilePage() {
  const user = useAuthStore(s => s.user);
  const myEntries = useMemo(() => getEnrichedPriceEntries().filter(e => e.submittedBy === user?.id), [user]);
  const { open } = useRouteDialog();
  const [editName, setEditName] = useState(user?.name ?? '');
  const [editCity, setEditCity] = useState(user?.city ?? '');

  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto flex flex-col gap-8">
      
      {/* Top Banner - technical Protocol Style */}
      <div className="bg-bg-surface border border-text-main shadow-[8px_8px_0px_rgba(0,102,255,0.2)] p-10 flex flex-col md:flex-row items-center md:items-start gap-10">
        <div className="relative">
          <div className="w-40 h-40 bg-text-main text-bg-base flex items-center justify-center text-5xl font-serif font-black shadow-[4px_4px_0px_#0066FF]">
            {user.avatarInitials}
          </div>
          <button
            onClick={() => open('edit-profile')}
            className="absolute -bottom-4 -right-4 w-12 h-12 bg-bg-surface border border-text-main flex items-center justify-center text-text-main hover:bg-primary hover:text-white transition-all shadow-[2px_2px_0px_#0066FF]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>settings_accessibility</span>
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
            <div>
              <span className="text-primary font-bold text-[10px] tracking-[0.4em] uppercase mb-2 block">AUTH_PROTOCOL // USER_IDENTIFIER</span>
              <h1 className="text-5xl font-serif font-black text-text-main uppercase tracking-tight leading-none">{user.name}</h1>
            </div>
            <TrustBadge score={user.trustScore} size="lg" className="bg-bg-base border border-border-soft px-6 py-3 shadow-[4px_4px_0px_rgba(0,102,255,0.1)]" />
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mb-8 text-[11px] font-bold text-text-muted uppercase tracking-widest">
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">alternate_email</span> {user.email}</span>
            <span className="w-1.5 h-1.5 bg-border-soft" />
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">distance</span> {user.city}, LEB</span>
            <span className="w-1.5 h-1.5 bg-border-soft" />
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-primary">history_edu</span> EST {new Date(user.joinedAt).getFullYear()}</span>
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="bg-bg-base border border-border-soft p-6 min-w-[160px] shadow-[2px_2px_0px_rgba(0,0,0,0.05)]">
              <p className="text-3xl font-serif font-black text-text-main">{user.uploadCount}</p>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mt-2">DATA_TRANSMISSIONS</p>
            </div>
            <div className="bg-bg-base border border-blue-500/20 p-6 min-w-[160px] shadow-[2px_2px_0px_rgba(0,102,255,0.1)]">
              <p className="text-3xl font-serif font-black text-primary">{user.verifiedCount}</p>
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-2">VALIDATED_ENTRIES</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Monitored Products - Blueprint Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-text-main pb-4">
            <h2 className="text-sm font-black text-text-main uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">data_thresholding</span>
              Active_Monitors
            </h2>
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">[SCOPE_LIVE]</span>
          </div>
          <div className="bg-bg-surface border border-border-soft p-2 shadow-sm">
            {MOCK_PRODUCTS.slice(0, 5).map(product => (
              <div key={product.id} className="flex flex-col p-5 border-b border-border-soft last:border-0 hover:bg-bg-base transition-all cursor-pointer group">
                <p className="text-[11px] font-black text-text-main uppercase tracking-wider group-hover:text-primary transition-colors">{product.name}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[9px] font-bold text-text-muted flex items-center gap-2 uppercase tracking-tighter">
                    <span className="material-symbols-outlined text-[14px]">sensors</span> MONITORING_ACTIVE
                  </span>
                  <span className="text-xs font-serif font-black text-text-main border-b border-primary/30">LBP {(Math.random() * 50000 + 40000).toFixed(0)}</span>
                </div>
              </div>
            ))}
            <button className="w-full text-center text-[10px] font-black text-primary py-4 hover:bg-bg-base transition-all uppercase tracking-[0.3em] border-t border-border-soft bg-blue-500/5">
              ACCESS_FULL_OBSERVATORY
            </button>
          </div>
        </div>

        {/* Contribution History - structural Table */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-text-main pb-4">
            <h2 className="text-sm font-black text-text-main uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">history</span>
              Transmission_Logs
            </h2>
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">[SEQ_ALPHA]</span>
          </div>
          <div className="bg-bg-surface border border-border-soft shadow-sm overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-bg-base border-b border-border-soft">
                  <tr>
                    <th className="py-5 px-6 text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">ENTITY_ID</th>
                    <th className="py-5 px-6 text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">VALUATION</th>
                    <th className="py-5 px-6 text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">TIMESTAMP</th>
                    <th className="py-5 px-6 text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft">
                  {myEntries.slice(0, 8).map(entry => (
                    <tr key={entry.id} className="hover:bg-bg-base transition-colors group">
                      <td className="py-5 px-6">
                        <p className="text-[11px] font-black text-text-main uppercase tracking-tight group-hover:text-primary">{entry.product?.name}</p>
                        <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest mt-1 opacity-60">{entry.store?.name}</p>
                      </td>
                      <td className="py-5 px-6 font-serif font-black text-xs text-text-main">{formatLBP(entry.priceLbp)}</td>
                      <td className="py-5 px-6 text-[10px] text-text-sub font-mono">{new Date(entry.createdAt).toLocaleDateString().replace(/\//g, ' . ')}</td>
                      <td className="py-5 px-6"><StatusBadge status={entry.status} /></td>
                    </tr>
                  ))}
                </tbody>
             </table>
             {myEntries.length === 0 && (
               <div className="p-16 text-center text-[10px] font-bold text-text-muted uppercase tracking-widest font-mono">NO_TRANSMISSIONS_DETECTED</div>
             )}
          </div>
        </div>
      </div>

      {/* Danger Zone - technical Redact Style */}
      <div className="bg-red-600/5 border border-red-600/30 p-8 shadow-[6px_6px_0px_rgba(220,38,38,0.1)] mt-8">
        <h2 className="text-sm font-black text-red-600 flex items-center gap-3 mb-6 uppercase tracking-[0.4em]">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>terminal</span>
          TERMINATE_ACCESS_ZONE
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => open('delete-submissions')}
            className="btn-consulate h-14 px-8 border-red-600/40 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center gap-3 shadow-[2px_2px_0px_rgba(220,38,38,0.2)]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete_sweep</span>
            PURGE_DATA_ENTRIES
          </button>
          <button
            onClick={() => open('delete-account')}
            className="btn-consulate h-14 px-8 border-red-600 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center gap-3 shadow-[4px_4px_0px_rgba(220,38,38,0.3)]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_remove</span>
            TERMINATE_PROTOCOL
          </button>
        </div>
      </div>

      {/* ── URL-Driven Dialogs ────────────────────────── */}

      {/* Edit Profile Dialog */}
      <RouteDialog dialogId="edit-profile" title="Edit Profile" description="Update your display name and city.">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5 block">Display Name</label>
            <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full h-11 bg-bg-muted border border-border-soft rounded-xl px-4 text-sm text-text-main focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5 block">City</label>
            <input value={editCity} onChange={e => setEditCity(e.target.value)} className="w-full h-11 bg-bg-muted border border-border-soft rounded-xl px-4 text-sm text-text-main focus:border-primary focus:outline-none" />
          </div>
          <button className="h-10 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-all mt-2">Save Changes</button>
        </div>
      </RouteDialog>

      {/* Delete Submissions Confirm */}
      <ConfirmDialog
        dialogId="delete-submissions"
        title="Delete All Submissions"
        description={`This will permanently remove all ${myEntries.length} of your price submissions. This action cannot be undone.`}
        confirmLabel="Delete All"
        variant="danger"
        permission="bulk:delete"
        approvalLabel="Bulk delete all my price submissions"
        approvalPayload={{ scope: 'all_submissions', userId: user.id }}
        onConfirm={() => {}}
      />

      {/* Delete Account Confirm */}
      <ConfirmDialog
        dialogId="delete-account"
        title="Delete Account"
        description="Your account and all associated data will be permanently removed. This cannot be reversed."
        confirmLabel="Delete My Account"
        variant="danger"
        permission="account:delete"
        approvalLabel="Delete my account"
        approvalPayload={{ userId: user.id, reason: 'User initiated' }}
        onConfirm={() => {}}
      />
    </motion.div>
  );
}
