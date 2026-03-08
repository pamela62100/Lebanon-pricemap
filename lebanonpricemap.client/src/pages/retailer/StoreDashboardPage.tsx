import { motion } from 'framer-motion';
import { getEnrichedStores, getEnrichedProducts } from '@/api/mockData';
import { KpiCard } from '@/components/cards/KpiCard';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatLBP } from '@/lib/utils';
import { SyncStatusCard } from '@/components/retailer/SyncStatusCard';

export function StoreDashboardPage() {
  const navigate = useNavigate();
  const store = getEnrichedStores().find(s => s.id === 's1');
  const storeProducts = getEnrichedProducts().slice(0, 4);

  if (!store) return null;

  const stats: { icon: string; label: string; value: string | number; trend: number }[] = [
    { icon: 'visibility', label: 'Monthly Views', value: 3420, trend: 12 },
    { icon: 'inventory_2', label: 'Listed Items', value: 84, trend: 2 },
    { icon: 'local_offer', label: 'Active Promotions', value: 3, trend: 0 },
    { icon: 'verified_user', label: 'Store Trust Score', value: store.trustScore ?? 0, trend: 5 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">

      {/* Store Banner */}
      <div className="bg-bg-surface border border-border-soft rounded-2xl p-7 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
            {store.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-text-main">{store.name}</h1>
              <StatusBadge status={store.status ?? 'pending'} />
            </div>
            <p className="text-sm text-text-muted flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              {store.region} · Authorized Partner
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 md:mt-0 relative z-10">
          <button onClick={() => navigate('/retailer/promotions')} className="h-10 px-5 rounded-xl border border-border-primary bg-bg-surface font-semibold hover:border-primary hover:text-primary transition-colors text-sm">
            Manage Promos
          </button>
          <button onClick={() => navigate('/retailer/insights')} className="h-10 px-5 rounded-xl bg-primary text-white font-semibold flex items-center gap-2 hover:opacity-90 shadow-md text-sm transition-all">
            <span className="material-symbols-outlined text-[18px]">insights</span>
            Insights
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {stats.map(stat => (
              <KpiCard key={stat.label} {...stat} className="bg-bg-surface border border-border-soft rounded-2xl shadow-sm" />
            ))}
          </div>

          <div className="bg-bg-surface border border-border-soft rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-border-soft flex items-center justify-between bg-bg-muted/30">
              <h2 className="text-base font-black text-text-main flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">inventory</span>
                Catalog Preview
              </h2>
              <button onClick={() => navigate('/retailer/products')} className="text-xs font-bold text-primary hover:underline">View all →</button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-bg-muted/50 border-b border-border-soft">
                <tr>
                  <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider">Product</th>
                  <th className="py-3 px-5 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {storeProducts.map((p, i) => (
                  <tr key={p.id} className="hover:bg-bg-muted/40 transition-colors">
                    <td className="py-3 px-5 font-semibold text-text-main text-sm">{p.name}</td>
                    <td className="py-3 px-5 text-right font-black text-text-main text-sm">
                      LBP {formatLBP(45000 + i * 15000).replace('LBP', '').trim()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <SyncStatusCard />
          <div className="bg-bg-surface border border-border-soft rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-text-main text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400 text-[20px]">report</span>
                Customer Reports
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-red-400/10 text-red-400 text-[10px] font-bold border border-red-400/20">2 Pending</span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { title: 'Wrong price reported', sub: 'Whole Milk TL 1L · Achrafieh Store' },
                { title: 'Outdated stock', sub: 'Eggs 30 Pack · Beirut Store' },
              ].map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-bg-muted/50 border border-border-soft">
                  <p className="text-xs font-bold text-text-main">{r.title}</p>
                  <p className="text-[11px] text-text-muted mt-1">{r.sub}</p>
                  <button className="text-[11px] font-bold text-primary mt-2">Resolve now →</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}