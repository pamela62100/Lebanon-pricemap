import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { KpiCard } from '@/components/cards/KpiCard';
import { adminApi } from '@/api/admin.api';
import { feedbackApi } from '@/api/feedback.api';
import { useApprovalStore } from '@/store/useApprovalStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AdminStats {
  totalUsers: number;
  totalUploads: number;
  flaggedEntries: number;
  activeStores: number;
}

export function AdminOverviewPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [openFeedbackCount, setOpenFeedbackCount] = useState(0);

  const { fetchAll, pendingCount } = useApprovalStore();
  const pending = pendingCount();

  useEffect(() => {
    adminApi.getStats().then((res) => {
      const data = res.data?.data ?? res.data;
      setStats(data);
    }).catch(() => {});

    feedbackApi.getAll({ status: 'open' }).then((res) => {
      const data = res.data?.data ?? res.data;
      setOpenFeedbackCount(Array.isArray(data) ? data.length : 0);
    }).catch(() => {});

    fetchAll('pending');
  }, []);

  const kpiCards = stats
    ? [
        { icon: 'group', label: 'Total Users', value: stats.totalUsers, trend: 0 },
        { icon: 'cloud_upload', label: 'Uploads', value: stats.totalUploads, trend: 0 },
        { icon: 'flag', label: 'Flagged', value: stats.flaggedEntries, trend: 0 },
        { icon: 'storefront', label: 'Active Stores', value: stats.activeStores, trend: 0 },
      ]
    : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Overview</h1>
        <p className="text-sm text-text-muted mt-0.5">Platform activity and key metrics</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats ? kpiCards.map((stat) => (
          <KpiCard key={stat.label} {...stat} />
        )) : [1,2,3,4].map(i => (
          <div key={i} className="h-24 rounded-xl bg-bg-muted animate-pulse" />
        ))}
      </div>

      {/* Approval queue alert */}
      {pending > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/admin/approvals')}
          className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100 transition-all group"
        >
          <span className="material-symbols-outlined text-amber-500 text-[20px]">admin_panel_settings</span>
          <p className="flex-1 text-sm font-semibold text-amber-700">
            {pending} approval request{pending > 1 ? 's' : ''} awaiting review
          </p>
          <span className="material-symbols-outlined text-amber-400 text-[18px]">chevron_right</span>
        </motion.div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Platform summary */}
        <div className="col-span-2 bg-white border border-border-soft rounded-xl p-5">
          <p className="text-sm font-semibold text-text-main mb-4">Platform summary</p>
          {stats ? (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: 'group' },
                { label: 'Price Uploads', value: stats.totalUploads.toLocaleString(), icon: 'cloud_upload' },
                { label: 'Flagged Entries', value: stats.flaggedEntries.toLocaleString(), icon: 'flag' },
                { label: 'Active Stores', value: stats.activeStores.toLocaleString(), icon: 'storefront' },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-lg bg-bg-base border border-border-soft flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[18px]">{item.icon}</span>
                  <div>
                    <p className="text-[11px] text-text-muted">{item.label}</p>
                    <p className="text-lg font-bold text-text-main">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-lg bg-bg-muted animate-pulse" />)}
            </div>
          )}
        </div>

        {/* Side widgets */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-border-soft rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-text-main">Moderation</p>
              <span className="text-sm font-bold text-text-main">{openFeedbackCount}</span>
            </div>
            <p className="text-xs text-text-muted mb-3">Open feedback items</p>
            <button onClick={() => navigate('/admin/flagged')} className="w-full py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:opacity-90 transition-all">
              Review queue
            </button>
          </div>

          <div className={cn('rounded-xl p-4 border', pending > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-border-soft')}>
            <p className={cn('text-sm font-semibold mb-1', pending > 0 ? 'text-amber-700' : 'text-text-main')}>
              Approvals
            </p>
            <p className="text-xs text-text-muted mb-3">
              {pending > 0 ? `${pending} pending request${pending > 1 ? 's' : ''}` : 'No pending requests'}
            </p>
            {pending > 0 && (
              <button onClick={() => navigate('/admin/approvals')} className="text-xs font-semibold text-amber-600 hover:underline">
                Review →
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
