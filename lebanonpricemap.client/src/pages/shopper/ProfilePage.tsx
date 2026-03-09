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
    <div className="max-w-7xl mx-auto px-5 py-12 md:py-20 animate-page">
      <div className="flex flex-col gap-12">
        
        {/* Profile Identity (Dark Hero) */}
        <header className="card-dark p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-10 relative overflow-hidden">
          {/* Abstract Wave Background (SVG) */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white text-text-main rounded-[2rem] flex items-center justify-center text-3xl md:text-4xl font-bold shadow-2xl">
              {user.avatarInitials}
            </div>
            <button
              onClick={() => open('edit-profile')}
              className="absolute -bottom-1 -right-1 w-10 h-10 bg-white text-text-main rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-all border-[3px] border-text-main"
            >
              <span className="material-symbols-outlined text-lg">edit_square</span>
            </button>
          </div>

          <div className="flex-1 text-center md:text-left relative z-10 flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
               <div>
                 <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mb-3">Account_Protocol</p>
                 <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tighter leading-none">{user.name}</h1>
               </div>
               <div className="px-5 py-2.5 bg-white/10 rounded-xl border border-white/10 backdrop-blur-xl">
                  <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Trust_Score</p>
                  <div className="flex items-baseline gap-2">
                     <span className="text-2xl font-bold text-white font-data">{user.trustScore}</span>
                     <span className="text-[9px] font-bold text-green-400 uppercase">Verified</span>
                  </div>
               </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-[10px] font-bold text-white/60 uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-white/40">mail</span>
                {user.email}
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-white/40">location_on</span>
                {user.city}
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-white/40">schedule</span>
                Active_Since_{new Date(user.joinedAt).getFullYear()}
              </span>
            </div>
          </div>
        </header>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="card p-6 md:p-8 group hover:bg-text-main hover:text-white transition-all duration-500">
              <p className="text-[9px] font-bold text-text-muted group-hover:text-white/40 uppercase tracking-widest mb-1.5">Total_Reports</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-bold font-data tracking-tighter">{user.uploadCount}</span>
                 <span className="text-[9px] font-bold opacity-40 uppercase">Units</span>
              </div>
           </div>
           <div className="card p-6 md:p-8 border-green-500/20 bg-green-500/5 group hover:bg-green-500 hover:text-white transition-all duration-500">
              <p className="text-[9px] font-bold text-green-600 group-hover:text-white/40 uppercase tracking-widest mb-1.5">Verified_Intel</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-bold font-data tracking-tighter text-green-600 group-hover:text-white">{user.verifiedCount}</span>
                 <span className="text-[9px] font-bold opacity-40 uppercase">Hits</span>
              </div>
           </div>
           <div className="card p-6 md:p-8 lg:col-span-2 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Community_Impact</p>
                <p className="text-lg font-bold text-text-main tracking-tight">Tier_Gold Shopper</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <span className="material-symbols-outlined text-xl">workspace_premium</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Recent Transmission History */}
          <section className="lg:col-span-8 space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-main tracking-tighter">Transmission History.</h2>
                <div className="px-2.5 py-1 bg-text-main text-white rounded-full text-[8px] font-bold uppercase tracking-widest">
                   {myEntries.length} Signals
                </div>
             </div>
             
             <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                        <tr className="bg-bg-muted/30">
                          <th className="py-5 px-8 text-[10px] font-bold text-text-muted uppercase tracking-widest">Target_Signal</th>
                          <th className="py-5 px-8 text-[10px] font-bold text-text-muted uppercase tracking-widest">Value_LBP</th>
                          <th className="py-5 px-8 text-[10px] font-bold text-text-muted uppercase tracking-widest text-center">Protocol_Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-soft/40">
                         {myEntries.slice(0, 10).map(entry => (
                           <tr key={entry.id} className="group hover:bg-bg-muted/10 transition-colors">
                             <td className="py-6 px-8 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-bg-muted flex items-center justify-center text-text-muted group-hover:bg-text-main group-hover:text-white transition-colors">
                                   <span className="material-symbols-outlined text-lg">inventory_2</span>
                                </div>
                                <div className="min-w-0">
                                   <p className="font-bold text-text-main group-hover:text-text-main truncate transition-colors">{entry.product?.name}</p>
                                   <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1 opacity-40 truncate">{entry.store?.name}</p>
                                </div>
                             </td>
                             <td className="py-6 px-8">
                                <p className="text-lg font-bold text-text-main font-data tracking-tighter">
                                   {entry.priceLbp.toLocaleString()}
                                </p>
                             </td>
                             <td className="py-6 px-8 text-center">
                                <StatusBadge status={entry.status} />
                             </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                {myEntries.length === 0 && (
                  <div className="p-20 flex flex-col items-center text-center">
                     <span className="material-symbols-outlined text-5xl text-text-muted/10 mb-6">sensors_off</span>
                     <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2">Zero_Transmission_History</p>
                     <p className="text-sm font-medium text-text-muted opacity-40 max-w-xs leading-relaxed">
                        Start reporting prices at retail nodes to build your market transparency profile.
                     </p>
                  </div>
                )}
             </div>
          </section>

          {/* Side Intelligence */}
          <aside className="lg:col-span-4 space-y-12">
             <div className="space-y-6">
                <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Signal_Thresholds</h3>
                <div className="space-y-3">
                   {MOCK_PRODUCTS.slice(0, 4).map(product => (
                     <div key={product.id} className="p-4 rounded-2xl bg-white border border-border-soft flex items-center justify-between hover:border-text-main/20 transition-all cursor-pointer group shadow-sm">
                        <div className="min-w-0">
                           <p className="text-[11px] font-bold text-text-main truncate group-hover:text-text-main">{product.name}</p>
                           <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1 opacity-60">Status: Active</p>
                        </div>
                        <span className="material-symbols-outlined text-lg text-text-muted opacity-20 group-hover:opacity-100 transition-opacity">arrow_forward_ios</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="p-8 rounded-[2rem] bg-red-500/5 border border-red-500/10 space-y-6">
                <h3 className="text-[10px] font-bold text-red-600 uppercase tracking-[0.2em] flex items-center gap-2">
                   <span className="material-symbols-outlined text-lg">warning</span>
                   Emergency_Protocols
                </h3>
                <div className="space-y-4">
                  <button onClick={() => open('delete-submissions')} className="w-full h-12 rounded-xl border border-red-500/20 text-red-600 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    Terminal_Purge [Submissions]
                  </button>
                  <button onClick={() => open('delete-account')} className="w-full h-12 rounded-xl bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">
                    Account_Decommission
                  </button>
                </div>
             </div>
          </aside>
        </div>
      </div>

      {/* Dialogs */}
      <RouteDialog dialogId="edit-profile" title="Update_Identity_Protocol" description="Modifier your system display credentials and geographic primary node.">
        <div className="space-y-8 py-4">
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Coded_Identifier</p>
            <input 
               value={editName} 
               onChange={e => setEditName(e.target.value)} 
               className="w-full h-14 bg-bg-muted border-none rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-text-main/10 transition-all" 
            />
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Primary_District_Node</p>
            <input 
               value={editCity} 
               onChange={e => setEditCity(e.target.value)} 
               className="w-full h-14 bg-bg-muted border-none rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-text-main/10 transition-all" 
            />
          </div>
          <button className="btn-primary w-full h-14 rounded-2xl shadow-xl shadow-text-main/10 mt-4">
            Commit Identity Update
          </button>
        </div>
      </RouteDialog>

      <ConfirmDialog dialogId="delete-submissions" title="Purge Submissions" description={`Strategic operation: Permanently remove ${myEntries.length} signal transmissions? This action is irreversible.`} confirmLabel="Execute Purge" variant="danger" permission="bulk:delete" approvalLabel="Authorize total submission wipe" approvalPayload={{ scope: 'all_submissions', userId: user.id }} onConfirm={() => {}} />
      <ConfirmDialog dialogId="delete-account" title="Decommission Account" description="Terminal sequence initiated: Purge all credentials and data nodes?" confirmLabel="Confirm Decommission" variant="danger" permission="account:delete" approvalLabel="Authorize account termination" approvalPayload={{ userId: user.id, reason: 'User initiated' }} onConfirm={() => {}} />
    </div>
  );
}