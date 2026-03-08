import { motion } from 'framer-motion';
import { getEnrichedStores, getEnrichedProducts } from '@/api/mockData';
import { KpiCard } from '@/components/cards/KpiCard';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatLBP } from '@/lib/utils';

export function StoreDashboardPage() {
  const navigate = useNavigate();
  // Mock store id 's1'
  const store = getEnrichedStores().find(s => s.id === 's1');
  const storeProducts = getEnrichedProducts().slice(0, 4);

  if (!store) return null;

  const stats: { icon: string; label: string; value: string | number; trend: number }[] = [
    { icon: 'visibility', label: 'Monthly Views', value: 3420, trend: 12 },
    { icon: 'inventory_2', label: 'Listed Items', value: 84, trend: 2 },
    { icon: 'local_offer', label: 'Active Promotions', value: 3, trend: 0 },
    { icon: 'verified_user', label: 'Store Trust Score', value: store.trustScore, trend: 5 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      
      {/* Store Banner */}
      <div className="bg-bg-surface border border-border-soft rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-soft rounded-full opacity-20 -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
            {store.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-text-main font-display">{store.name}</h1>
              <StatusBadge status={store.status} />
            </div>
            <p className="text-sm text-text-muted flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>location_on</span>
              {store.region} · Authorized Partner
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6 md:mt-0 relative z-10">
          <button onClick={() => navigate('/app/retailer/promotions')} className="h-10 px-5 rounded-xl border border-border-primary bg-bg-surface font-semibold hover:border-primary hover:text-primary transition-colors cursor-pointer">
            Manage Promos
          </button>
          <button onClick={() => navigate('/app/retailer/insights')} className="h-10 px-5 rounded-xl bg-primary text-white font-semibold flex items-center gap-2 hover:bg-primary-hover shadow-md cursor-pointer transition-all">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>insights</span>
            Insights
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <KpiCard key={stat.label} {...stat} className="bg-bg-surface border border-border-soft rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]" />
        ))}
      </div>

      {/* Product List Data Grid */}
      <div className="bg-bg-surface border border-border-soft rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border-soft flex items-center justify-between bg-bg-muted/30">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">inventory</span>
            Your Product Catalog
          </h2>
          <div className="flex items-center gap-2 bg-bg-surface border border-border-primary rounded-lg px-3 h-10 w-64 shadow-sm focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '18px' }}>search</span>
            <input placeholder="Search catalog..." className="bg-transparent border-none outline-none text-sm text-text-main placeholder:text-text-muted flex-1" />
          </div>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-bg-muted/50 border-b border-border-soft">
            <tr>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-widest">Product Name</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-widest">Category</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-widest text-right">Your Listed Price</th>
              <th className="py-4 px-6 text-xs font-bold text-text-muted uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {storeProducts.map((p, i) => (
              <tr key={p.id} className="hover:bg-bg-muted/40 transition-colors group">
                <td className="py-5 px-6 font-semibold text-text-main flex flex-col">
                  {p.name}
                  <span className="text-xs font-normal text-text-muted font-mono">{p.id}</span>
                </td>
                <td className="py-5 px-6">
                  <span className="px-3 py-1 bg-border-soft text-text-sub rounded-md text-xs font-bold">{p.category}</span>
                </td>
                <td className="py-5 px-6 text-right font-display font-bold text-lg text-text-main tracking-tight">
                  <span className="text-secondary text-base font-sans mr-1 opacity-50">LBP</span> 
                  {formatLBP(45000 + i * 15000).replace('LBP', '').trim()}
                </td>
                <td className="py-5 px-6">
                  <div className="flex justify-center">
                    <button 
                      onClick={() => navigate(`/app/retailer/price/${p.id}/edit`)}
                      className="px-4 py-1.5 rounded-lg border border-border-primary text-sm font-semibold text-text-main hover:border-primary hover:text-primary hover:bg-primary-soft/50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      Update Price
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </motion.div>
  );
}
