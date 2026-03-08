import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { KpiCard } from '@/components/cards/KpiCard';
import { FeedbackCard } from '@/components/cards/FeedbackCard';
import { getEnrichedFeedback } from '@/api/mockData';
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
  const openFeedback = useMemo(() => getEnrichedFeedback().filter(f => f.status === 'open'), []);

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

      {/* Two column: Map placeholder + Recent Flags */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Map placeholder */}
        <div className="col-span-2 bg-bg-surface border border-border-soft rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-text-main">Activity Distribution</h3>
              <p className="text-sm text-text-muted">Live heatmap of user interactions across Lebanon</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary"></span> High</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-bg-muted"></span> Low</span>
            </div>
          </div>
          <div className="h-72 rounded-xl bg-bg-muted flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-text-muted text-5xl mb-2 block">map</span>
              <p className="text-sm text-text-muted">Lebanon Activity Map</p>
              <p className="text-xs text-text-muted">Active Sessions: 4,120 · New Stores: +12 today</p>
            </div>
          </div>
        </div>

        {/* Recent Flags */}
        <div className="bg-bg-surface border border-border-soft rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-main">Recent Flags</h3>
            <span className="text-xs font-bold text-primary bg-primary-soft px-2 py-1 rounded-full">{openFeedback.length} New</span>
          </div>
          <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
            {openFeedback.map(fb => (
              <FeedbackCard key={fb.id} feedback={fb} onResolve={() => {}} />
            ))}
            {openFeedback.length === 0 && (
              <p className="text-sm text-text-muted text-center py-8">No open flags</p>
            )}
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
