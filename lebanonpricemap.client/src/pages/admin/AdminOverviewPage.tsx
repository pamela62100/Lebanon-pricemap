import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { KpiCard } from '@/components/cards/KpiCard';
import { FeedbackCard } from '@/components/cards/FeedbackCard';
import { getEnrichedFeedback, MOCK_STORES } from '@/api/mockData';
import { useApprovalStore } from '@/store/useApprovalStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const STATS = [
  { icon: 'group', label: 'Total Users', value: 12840, trend: 12 },
  { icon: 'cloud_upload', label: 'Uploads', value: 45201, trend: 5 },
  { icon: 'flag', label: 'Flagged', value: 128, trend: -2 },
  { icon: 'storefront', label: 'Active Stores', value: 842, trend: 8 },
];

const REGIONS = [
  { region: "Beirut District", activeUsers: 4812, newStores: 124, flagRate: "0.8%", status: "Stable" },
  { region: "Mount Lebanon",  activeUsers: 3205, newStores: 82,  flagRate: "1.2%", status: "Stable" },
  { region: "North Lebanon",  activeUsers: 2140, newStores: 45,  flagRate: "2.4%", status: "Warning" },
  { region: "South Lebanon",  activeUsers: 1950, newStores: 38,  flagRate: "1.5%", status: "Stable" },
];

export function AdminOverviewPage() {
  const navigate = useNavigate();
  const openFeedback = useMemo(() => getEnrichedFeedback().filter(f => f.status === 'open'), []);
  const pendingApprovals = useApprovalStore(s => s.pendingCount());

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Admin Overview</h1>
          <p className="text-sm text-text-muted mt-1">Monitor platform activity and manage community</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-bg-surface border border-border-soft rounded-xl px-4 h-10">
            <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '18px' }}>search</span>
            <input placeholder="Search data..." className="bg-transparent border-none outline-none text-sm text-text-main placeholder:text-text-muted w-48" />
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {STATS.map(stat => (
          <KpiCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Approval Queue CTA — shows only when there are pending requests */}
      {pendingApprovals > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/admin/approvals')}
          className="flex items-center gap-4 p-4 mb-8 bg-amber-400/5 border border-amber-400/30 rounded-2xl cursor-pointer hover:bg-amber-400/10 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-amber-500" style={{ fontSize: '20px' }}>admin_panel_settings</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-amber-600 dark:text-amber-400 text-sm">
              {pendingApprovals} approval request{pendingApprovals > 1 ? 's' : ''} awaiting review
            </p>
            <p className="text-xs text-amber-500/70 mt-0.5">Click to open the Approval Queue →</p>
          </div>
          <span className="material-symbols-outlined text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
        </motion.div>
      )}

      {/* Two column: Live Feed + Recent Flags */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        {/* Live Activity Feed */}
        <div className="col-span-2 bg-bg-surface border border-border-soft rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                Live Activity Feed
              </h3>
              <p className="text-sm text-text-muted mt-0.5">Real-time platform events across all regions</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              LIVE
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            {[
              { type: 'price', text: 'New price verified at Spinneys Achrafieh', time: '2m ago', icon: 'check_circle', color: 'text-green-500' },
              { type: 'store', text: 'New retailer application: Alpha Market Tripoli', time: '14m ago', icon: 'storefront', color: 'text-primary' },
              { type: 'anomaly', text: 'Price spike detected (42%): Gasoline 95 at Carrefour', time: '28m ago', icon: 'warning', color: 'text-amber-500' },
              { type: 'user', text: 'User "Fouad G." reached Trust Level 4', time: '1h ago', icon: 'military_tech', color: 'text-primary' },
              { type: 'report', text: 'Price mismatch report by community member', time: '2h ago', icon: 'report', color: 'text-red-400' },
            ].map((event, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-bg-muted/30 border border-border-soft hover:border-primary/30 transition-all cursor-pointer">
                <div className={cn("w-10 h-10 rounded-xl bg-bg-surface flex items-center justify-center border border-border-soft", event.color)}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{event.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-main">{event.text}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{event.time}</p>
                </div>
                <span className="material-symbols-outlined text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex flex-col gap-6">
          {/* Moderation Queue widget */}
          <div className="bg-bg-surface border border-border-soft rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">fact_check</span>
              Moderation Queue
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Pending items</span>
                <span className="font-bold text-text-main">{openFeedback.length}</span>
              </div>
              <div className="h-2 bg-bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '65%' }} />
              </div>
              <button onClick={() => navigate('/admin/flagged')} className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-all">
                Review queue →
              </button>
            </div>
          </div>

          {/* Anomaly widget */}
          <div className="bg-amber-400/5 border border-amber-400/20 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-amber-500 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              Price Anomalies
            </h3>
            <p className="text-[11px] text-amber-600/80 leading-relaxed">
              We've detected 5 products with suspicious price movements in the last 24h.
            </p>
            <button onClick={() => navigate('/admin/anomalies')} className="mt-4 text-xs font-bold text-amber-500 flex items-center gap-1 hover:underline">
              Investigate spikes →
            </button>
          </div>
        </div>
      </div>

      {/* Regional table */}
      <div className="bg-bg-surface border border-border-soft rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text-main">Regional Overview</h3>
          <button className="text-sm font-semibold text-primary flex items-center gap-1">
            Download Report
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-soft">
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Region</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Active Users</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">New Stores</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Flag Rate</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {REGIONS.map(row => (
              <tr key={row.region} className="border-b border-bg-muted hover:bg-primary-soft/40 transition-colors">
                <td className="py-4 px-4 text-sm font-medium text-text-main">{row.region}</td>
                <td className="py-4 px-4 text-sm text-text-sub">{row.activeUsers.toLocaleString()}</td>
                <td className="py-4 px-4 text-sm text-text-sub">{row.newStores}</td>
                <td className="py-4 px-4 text-sm text-text-sub">{row.flagRate}</td>
                <td className="py-4 px-4">
                  <span className={cn(
                    'text-xs font-semibold',
                    row.status === 'Stable' ? 'text-[var(--status-verified-text)]' : 'text-[var(--status-pending-text)]'
                  )}>
                    ● {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
