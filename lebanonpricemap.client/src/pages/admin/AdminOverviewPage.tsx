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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Admin Overview</h1>
          <p className="text-sm text-text-muted mt-1">Monitor platform activity and manage community</p>
        </div>
      </div>

      {/* KPI cards */}
      {stats ? (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {kpiCards.map((stat) => (
            <KpiCard key={stat.label} {...stat} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {/* Approval Queue CTA */}
      {pending > 0 && (
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
            <p className="font-bold text-amber-600 text-sm">
              {pending} approval request{pending > 1 ? 's' : ''} awaiting review
            </p>
            <p className="text-xs text-amber-500/70 mt-0.5">Click to open the Approval Queue →</p>
          </div>
          <span className="material-symbols-outlined text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
        </motion.div>
      )}

      {/* Two column: widgets */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="col-span-2 bg-bg-surface border border-border-soft rounded-3xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                Platform Summary
              </h3>
              <p className="text-sm text-text-muted mt-0.5">Key metrics from the backend</p>
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: 'group' },
                { label: 'Price Uploads', value: stats.totalUploads.toLocaleString(), icon: 'cloud_upload' },
                { label: 'Flagged Entries', value: stats.flaggedEntries.toLocaleString(), icon: 'flag' },
                { label: 'Active Stores', value: stats.activeStores.toLocaleString(), icon: 'storefront' },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-2xl bg-bg-muted/30 border border-border-soft flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-bg-surface flex items-center justify-center border border-border-soft text-primary">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">{item.label}</p>
                    <p className="text-xl font-bold text-text-main font-data">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {/* Moderation Queue widget */}
          <div className="bg-bg-surface border border-border-soft rounded-3xl p-6 shadow-card">
            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">fact_check</span>
              Moderation Queue
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Open feedback</span>
                <span className="font-bold text-text-main">{openFeedbackCount}</span>
              </div>
              <div className="h-2 bg-bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: openFeedbackCount > 0 ? '65%' : '0%' }} />
              </div>
              <button onClick={() => navigate('/admin/flagged')} className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-all">
                Review queue →
              </button>
            </div>
          </div>

          {/* Approvals widget */}
          <div className={cn(
            'rounded-3xl p-6 shadow-card border',
            pending > 0 ? 'bg-amber-400/5 border-amber-400/20' : 'bg-bg-surface border-border-soft'
          )}>
            <h3 className={cn('font-bold mb-4 flex items-center gap-2', pending > 0 ? 'text-amber-500' : 'text-text-main')}>
              <span className="material-symbols-outlined">admin_panel_settings</span>
              Approvals
            </h3>
            <p className="text-[11px] leading-relaxed" style={{ color: pending > 0 ? 'var(--amber-600)' : 'var(--text-muted)' }}>
              {pending > 0
                ? `${pending} pending request${pending > 1 ? 's' : ''} need your review.`
                : 'No pending approval requests.'}
            </p>
            {pending > 0 && (
              <button onClick={() => navigate('/admin/approvals')} className="mt-4 text-xs font-bold text-amber-500 flex items-center gap-1 hover:underline">
                Review approvals →
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
