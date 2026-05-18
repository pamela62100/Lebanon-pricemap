import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { KpiCard } from '@/components/cards/KpiCard';
import { adminApi } from '@/api/admin.api';
import { storesApi } from '@/api/stores.api';
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
  const [pendingStores, setPendingStores] = useState(0);

  useEffect(() => {
    adminApi.getStats().then((res) => {
      const data = res.data?.data ?? res.data;
      setStats(data);
    }).catch(() => {});

    storesApi.getAll({ includeAll: true }).then((res) => {
      const data = res.data?.data ?? res.data;
      const stores = Array.isArray(data) ? data : [];
      const pending = stores.filter((s: any) =>
        s.status !== 'verified' && s.status !== 'flagged' && !s.isVerifiedRetailer
      ).length;
      setPendingStores(pending);
    }).catch(() => {});
  }, []);

  const kpiCards = stats
    ? [
        { icon: 'group',      label: 'Total Users',      value: stats.totalUsers,    trend: 0 },
        { icon: 'storefront', label: 'Active Stores',     value: stats.activeStores,  trend: 0 },
        { icon: 'flag',       label: 'Pending Reports',   value: stats.pendingReports, trend: 0 },
        { icon: 'pending',    label: 'Stores Awaiting Approval', value: pendingStores, trend: 0 },
      ]
    : [];

  const pendingReports = stats?.pendingReports ?? 0;

  const quickActions = [
    ...(pendingStores > 0 ? [{
      icon: 'storefront',
      label: 'Review pending stores',
      count: pendingStores,
      color: 'amber',
      path: '/admin/stores',
    }] : []),
    ...(pendingReports > 0 ? [{
      icon: 'flag',
      label: 'Review discrepancy reports',
      count: pendingReports,
      color: 'red',
      path: '/admin/reports',
    }] : []),
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Overview</h1>
        <p className="text-sm text-text-muted mt-0.5">Platform activity and key metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats ? kpiCards.map((stat) => (
          <KpiCard key={stat.label} {...stat} />
        )) : [1,2,3,4].map(i => (
          <div key={i} className="h-24 rounded-xl bg-bg-muted animate-pulse" />
        ))}
      </div>

      {quickActions.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-text-main">Action required</h2>
          <div className="flex flex-col gap-2 max-w-lg">
            {quickActions.map(action => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className={cn(
                  'flex items-center justify-between gap-4 rounded-xl p-4 border text-left transition-all hover:shadow-sm',
                  action.color === 'amber'
                    ? 'bg-amber-50 border-amber-200 hover:border-amber-300'
                    : 'bg-red-50 border-red-200 hover:border-red-300'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn('material-symbols-outlined text-[20px]',
                    action.color === 'amber' ? 'text-amber-500' : 'text-red-500'
                  )}>{action.icon}</span>
                  <span className={cn('text-sm font-semibold',
                    action.color === 'amber' ? 'text-amber-800' : 'text-red-800'
                  )}>{action.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('text-xs font-black px-2 py-0.5 rounded-full',
                    action.color === 'amber' ? 'bg-amber-200 text-amber-800' : 'bg-red-200 text-red-800'
                  )}>{action.count}</span>
                  <span className={cn('material-symbols-outlined text-[16px]',
                    action.color === 'amber' ? 'text-amber-400' : 'text-red-400'
                  )}>arrow_forward</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {quickActions.length === 0 && stats && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 max-w-md">
          <span className="material-symbols-outlined text-green-500 text-[22px]">check_circle</span>
          <p className="text-sm font-semibold text-green-800">All caught up — no pending actions.</p>
        </div>
      )}
    </motion.div>
  );
}
