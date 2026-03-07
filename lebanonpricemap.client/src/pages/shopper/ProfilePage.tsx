import { motion } from 'framer-motion';
import { TrustBadge } from '@/components/ui/TrustBadge';
import { useAuthStore } from '@/store/useAuthStore';
import { cn, formatLBP } from '@/lib/utils';
import { MOCK_PRODUCTS, getEnrichedPriceEntries } from '@/api/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useMemo } from 'react';

export function ProfilePage() {
  const user = useAuthStore(s => s.user);
  const myEntries = useMemo(() => getEnrichedPriceEntries().filter(e => e.submittedBy === user?.id), [user]);

  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto flex flex-col gap-8">
      
      {/* Top Banner Dashboard Style */}
      <div className="bg-bg-surface border border-border-soft rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-indigo-400 text-white flex items-center justify-center text-4xl font-bold font-display shadow-lg">
            {user.avatarInitials}
          </div>
          <button className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-bg-surface border border-border-soft flex items-center justify-center text-text-sub hover:text-primary hover:border-primary transition-colors shadow-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <h1 className="text-3xl font-bold text-text-main">{user.name}</h1>
            <TrustBadge score={user.trustScore} size="md" className="bg-bg-muted px-4 py-2 rounded-xl" />
          </div>
          <p className="text-sm text-text-muted flex items-center justify-center md:justify-start gap-2 mb-6">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mail</span> {user.email} 
            <span className="opacity-50">•</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span> {user.city}, Lebanon
            <span className="opacity-50">•</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calendar_today</span> Joined {new Date(user.joinedAt).getFullYear()}
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="bg-bg-muted rounded-xl px-6 py-3 min-w-[120px]">
              <p className="text-2xl font-bold text-text-main">{user.uploadCount}</p>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mt-1">Total Uploads</p>
            </div>
            <div className="bg-bg-muted rounded-xl px-6 py-3 min-w-[120px]">
              <p className="text-2xl font-bold text-text-main">{user.verifiedCount}</p>
              <p className="text-xs font-semibold text-[var(--status-verified-text)] uppercase tracking-wider mt-1">Verified Prices</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Saved Products column */}
        <div className="col-span-1 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">bookmark</span>
            Monitored Products
          </h2>
          <div className="bg-bg-surface border border-border-soft rounded-2xl p-2 shadow-sm">
            {MOCK_PRODUCTS.slice(0, 5).map(product => (
              <div key={product.id} className="flex flex-col p-4 border-b border-border-soft last:border-0 hover:bg-bg-muted/50 rounded-xl transition-colors cursor-pointer group">
                <p className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors">{product.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <span className="material-symbols-outlined" style={{fontSize: '14px'}}>notifications_active</span> Alert set
                  </span>
                  <span className="text-sm font-bold text-text-main">LBP {(Math.random() * 50000 + 40000).toFixed(0)}</span>
                </div>
              </div>
            ))}
            <button className="w-full text-center text-sm font-semibold text-primary py-3 hover:bg-primary-soft rounded-xl transition-colors mt-1">
              View All Tracked Items
            </button>
          </div>
        </div>

        {/* Contribution History Column */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">receipt_long</span>
            Contribution History
          </h2>
          <div className="bg-bg-surface border border-border-soft rounded-2xl shadow-sm overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-bg-muted/50 border-b border-border-soft">
                  <tr>
                    <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Product / Store</th>
                    <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Price Submitted</th>
                    <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Date</th>
                    <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft">
                  {myEntries.slice(0, 8).map(entry => (
                    <tr key={entry.id} className="hover:bg-bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <p className="text-sm font-bold text-text-main">{entry.product?.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{entry.store?.name}</p>
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-text-main">{formatLBP(entry.priceLbp)}</td>
                      <td className="py-4 px-6 text-sm text-text-sub">{new Date(entry.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6"><StatusBadge status={entry.status} /></td>
                    </tr>
                  ))}
                </tbody>
             </table>
             {myEntries.length === 0 && (
               <div className="p-12 text-center text-text-muted">You haven't uploaded any receipts yet.</div>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
