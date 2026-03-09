import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Store } from '@/types';
import { cn } from '@/lib/utils';
import { catalogApi } from '@/api/catalog.api';

interface StoreCardProps {
  store: Store;
  index: number;
}

const POWER_STATUS = {
  stable:        { icon: 'bolt',    label: 'Stable Power',   color: 'text-green-500' },
  unstable:      { icon: 'flash_on', label: 'Unstable Power', color: 'text-amber-500' },
  reported_warm: { icon: 'thermostat', label: 'Reported Warm', color: 'text-red-500' },
};

export const StoreCard = ({ store, index }: StoreCardProps) => {
  const navigate  = useNavigate();
  const initials  = store.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const power     = POWER_STATUS[store.powerStatus as keyof typeof POWER_STATUS] ?? POWER_STATUS.stable;
  const itemCount = catalogApi.getByStore(store.id).length;

  const isHero = index === 0;

  if (isHero) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-dark p-8 cursor-pointer group relative"
        onClick={() => navigate(`/app/catalog/${store.id}`)}
      >
        <div className="flex items-start justify-between mb-8">
          <div>
             <div className="flex items-center gap-2 mb-3">
               <span className="material-symbols-outlined text-white/70" style={{ fontSize: '14px' }}>verified</span>
               <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Official Partner</span>
             </div>
             <h3 className="text-3xl font-bold text-white tracking-tight leading-none mb-2">{store.name}</h3>
             <p className="text-sm text-white/50">{store.district}, {store.city}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-bold text-white">
            {initials}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8 py-6 border-y border-white/10">
          <div>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Rate_LBP</p>
            <p className="text-xl font-bold text-white font-data">{store.internalRateLbp.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Items</p>
            <p className="text-xl font-bold text-white font-data">{itemCount}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Trust</p>
            <p className="text-xl font-bold text-white font-data">{store.trustScore}%</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[10px] font-data text-white/30 uppercase tracking-widest">Protocol_Active // 001</p>
          <button className="btn-icon bg-white text-text-main hover:bg-white/90">
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card p-5 cursor-pointer group hover:bg-bg-muted/30 transition-all"
      onClick={() => navigate(`/app/catalog/${store.id}`)}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-bg-muted flex items-center justify-center text-sm font-black text-text-muted group-hover:bg-bg-base transition-colors">
          {initials}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-text-main">{store.name}</h3>
            <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '14px' }}>verified</span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">{store.district}</p>
        </div>
      </div>

      <div className="flex items-center justify-between py-4 border-t border-border-soft">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-0.5">Rate</span>
          <span className="text-sm font-bold text-text-main font-data">{store.internalRateLbp.toLocaleString()}</span>
        </div>
        <div className="text-right flex flex-col">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-0.5">Trust</span>
          <span className="text-sm font-bold text-status-verified font-data">{store.trustScore}%</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-dashed border-border-soft flex items-center justify-between">
         <span className="text-[9px] font-data text-text-muted uppercase tracking-widest">{itemCount} items listed</span>
         <span className="material-symbols-outlined text-text-muted group-hover:text-text-main transition-colors" style={{ fontSize: '18px' }}>arrow_forward</span>
      </div>
    </motion.div>
  );
};
