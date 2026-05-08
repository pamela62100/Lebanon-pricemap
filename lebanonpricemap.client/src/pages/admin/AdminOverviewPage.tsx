import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { KpiCard } from '@/components/cards/KpiCard';
import { adminApi } from '@/api/admin.api';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AdminStats {
  totalUsers: number;
  totalUploads: number;
  activeStores: number;
  pendingReports: number;
}

export function AdminOverviewPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    adminApi.getStats().then((res) => {
      const data = res.data?.data ?? res.data;
      setStats(data);
    }).catch(() => {});
  }, []);

  const kpiCards = stats
    ? [
        { icon: 'group', label: 'Total Users', value: stats.totalUsers, trend: 0 },
        { icon: 'storefront', label: 'Active Stores', value: stats.activeStores, trend: 0 },
        { icon: 'flag', label: 'Pending Reports', value: stats.pendingReports, trend: 0 },
      ]
    : [];

  const pendingReports = stats?.pendingReports ?? 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Overview</h1>
        <p className="text-sm text-text-muted mt-0.5">Platform activity and key metrics</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats ? kpiCards.map((stat) => (
          <KpiCard key={stat.label} {...stat} />
        )) : [1,2,3,4].map(i => (
          <div key={i} className="h-24 rounded-xl bg-bg-muted animate-pulse" />
        ))}
      </div>

      {/* Reports widget */}
      <div className={cn('rounded-xl p-5 border max-w-md', pendingReports > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-border-soft')}>
        <p className={cn('text-sm font-semibold mb-1', pendingReports > 0 ? 'text-amber-700' : 'text-text-main')}>
          Discrepancy Reports
        </p>
        <p className="text-xs text-text-muted mb-3">
          {pendingReports > 0 ? `${pendingReports} pending review${pendingReports > 1 ? 's' : ''}` : 'No pending reports'}
        </p>
        {pendingReports > 0 && (
          <button onClick={() => navigate('/admin/reports')} className="text-xs font-semibold text-amber-600 hover:underline">
            Review →
          </button>
        )}
      </div>
    </motion.div>
  );
}
