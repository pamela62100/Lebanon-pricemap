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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto flex flex-col gap-6 p-6">

      {/* Profile Header */}
      <div className="bg-bg-surface border border-border-soft rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative">
          <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg">
            {user.avatarInitials}
          </div>
          <button
            onClick={() => open('edit-profile')}
            className="absolute -bottom-2 -right-2 w-9 h-9 bg-bg-surface border border-border-soft rounded-xl flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">Your Profile</p>
              <h1 className="text-3xl font-black text-text-main">{user.name}</h1>
            </div>
            <TrustBadge score={user.trustScore} size="lg" className="bg-bg-base border border-border-soft px-5 py-2.5 rounded-xl" />
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6 text-sm text-text-muted font-medium">
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-primary">alternate_email</span>{user.email}</span>
            <span className="w-1 h-1 rounded-full bg-border-soft" />
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-primary">location_on</span>{user.city}</span>
            <span className="w-1 h-1 rounded-full bg-border-soft" />
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>Joined {new Date(user.joinedAt).getFullYear()}</span>
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="bg-bg-base border border-border-soft rounded-xl p-4 min-w-[140px]">
              <p className="text-2xl font-black text-text-main">{user.uploadCount}</p>
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mt-1">Submissions</p>
            </div>
            <div className="bg-bg-base border border-primary/20 rounded-xl p-4 min-w-[140px]">
              <p className="text-2xl font-black text-primary">{user.verifiedCount}</p>
              <p className="text-[11px] font-bold text-primary/70 uppercase tracking-wider mt-1">Verified</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Monitored Products */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border-soft pb-3">
            <h2 className="text-sm font-black text-text-main uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">data_thresholding</span>
              Monitored Products
            </h2>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Live</span>
          </div>
          <div className="bg-bg-surface border border-border-soft rounded-xl overflow-hidden">
            {MOCK_PRODUCTS.slice(0, 5).map(product => (
              <div key={product.id} className="flex flex-col p-4 border-b border-border-soft last:border-0 hover:bg-bg-base transition-all cursor-pointer group">
                <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">{product.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-text-muted flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">sensors</span> Monitoring
                  </span>
                  <span className="text-sm font-black text-text-main">LBP {(Math.random() * 50000 + 40000).toFixed(0)}</span>
                </div>
              </div>
            ))}
            <button className="w-full text-center text-[11px] font-bold text-primary py-3 hover:bg-bg-base transition-all uppercase tracking-wider border-t border-border-soft">
              View All
            </button>
          </div>
        </div>

        {/* Submission History */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border-soft pb-3">
            <h2 className="text-sm font-black text-text-main uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">history</span>
              Submission History
            </h2>
          </div>
          <div className="bg-bg-surface border border-border-soft rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-bg-base border-b border-border-soft">
                <tr>
                  <th className="py-3 px-5 text-[10px] font-black text-text-muted uppercase tracking-wider">Product</th>
                  <th className="py-3 px-5 text-[10px] font-black text-text-muted uppercase tracking-wider">Price</th>
                  <th className="py-3 px-5 text-[10px] font-black text-text-muted uppercase tracking-wider">Date</th>
                  <th className="py-3 px-5 text-[10px] font-black text-text-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {myEntries.slice(0, 8).map(entry => (
                  <tr key={entry.id} className="hover:bg-bg-base transition-colors group">
                    <td className="py-4 px-5">
                      <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">{entry.product?.name}</p>
                      <p className="text-[11px] text-text-muted mt-0.5">{entry.store?.name}</p>
                    </td>
                    <td className="py-4 px-5 text-sm font-black text-text-main">{formatLBP(entry.priceLbp)}</td>
                    <td className="py-4 px-5 text-[11px] text-text-sub">{new Date(entry.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-5"><StatusBadge status={entry.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {myEntries.length === 0 && (
              <div className="p-12 text-center text-sm text-text-muted">No submissions yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h2 className="text-sm font-black text-red-600 flex items-center gap-2 mb-4 uppercase tracking-wider">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          Danger Zone
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => open('delete-submissions')}
            className="h-11 px-6 rounded-xl border border-red-300 text-red-600 font-bold text-sm hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            Delete All Submissions
          </button>
          <button
            onClick={() => open('delete-account')}
            className="h-11 px-6 rounded-xl bg-red-600/10 border border-red-400 text-red-600 font-bold text-sm hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">person_remove</span>
            Delete Account
          </button>
        </div>
      </div>

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
          <button className="h-10 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-all mt-2">Save Changes</button>
        </div>
      </RouteDialog>

      <ConfirmDialog dialogId="delete-submissions" title="Delete All Submissions" description={`This will permanently remove all ${myEntries.length} of your price submissions.`} confirmLabel="Delete All" variant="danger" permission="bulk:delete" approvalLabel="Bulk delete all my price submissions" approvalPayload={{ scope: 'all_submissions', userId: user.id }} onConfirm={() => {}} />
      <ConfirmDialog dialogId="delete-account" title="Delete Account" description="Your account and all data will be permanently removed." confirmLabel="Delete My Account" variant="danger" permission="account:delete" approvalLabel="Delete my account" approvalPayload={{ userId: user.id, reason: 'User initiated' }} onConfirm={() => {}} />
    </motion.div>
  );
}