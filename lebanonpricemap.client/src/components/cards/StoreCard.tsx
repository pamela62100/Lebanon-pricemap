import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Store } from '@/types';
import { catalogApi } from '@/api/catalog.api';

interface StoreCardProps {
  store: Store;
  index: number;
}

export const StoreCard = ({ store, index }: StoreCardProps) => {
  const navigate = useNavigate();
  const initials = store.name
    .split(' ')
    .map((name) => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const itemCount = catalogApi.getByStore(store.id).length;
  const isFeatured = index === 0;

  if (isFeatured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[32px] bg-[linear-gradient(135deg,#17181f_0%,#101116_100%)] p-6 sm:p-8 cursor-pointer group border border-white/5 shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
        onClick={() => navigate(`/app/catalog/${store.id}`)}
      >
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-white/70 text-[14px]">verified</span>
              <span className="text-xs font-semibold text-white/70">Official partner</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">
              {store.name}
            </h3>
            <p className="text-sm text-white/60">
              {store.district}, {store.city}
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-bold text-white shrink-0">
            {initials}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 mb-8 py-6 border-y border-white/10">
          <div>
            <p className="text-xs text-white/45 mb-1">Store rate</p>
            <p className="text-xl font-bold text-white font-data">
              {store.internalRateLbp.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-white/45 mb-1">Items</p>
            <p className="text-xl font-bold text-white font-data">{itemCount}</p>
          </div>

          <div>
            <p className="text-xs text-white/45 mb-1">Trust</p>
            <p className="text-xl font-bold text-white font-data">{store.trustScore}%</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-white/40">View store catalog</p>
          <button
            className="w-12 h-12 rounded-full bg-white text-text-main flex items-center justify-center"
            type="button"
          >
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
      className="bg-white border border-border-soft rounded-[28px] p-5 sm:p-6 cursor-pointer group hover:border-text-main/10 hover:shadow-sm transition-all"
      onClick={() => navigate(`/app/catalog/${store.id}`)}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-bg-muted flex items-center justify-center text-sm font-bold text-text-muted shrink-0">
          {initials}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-text-main truncate">{store.name}</h3>
            <span className="material-symbols-outlined text-text-muted text-[14px]">verified</span>
          </div>
          <p className="text-sm text-text-muted mt-1">{store.district}</p>
        </div>
      </div>

      <div className="flex items-center justify-between py-4 border-t border-border-soft gap-4">
        <div>
          <span className="text-xs text-text-muted block mb-1">Store rate</span>
          <span className="text-base font-semibold text-text-main font-data">
            {store.internalRateLbp.toLocaleString()}
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs text-text-muted block mb-1">Trust</span>
          <span className="text-base font-semibold text-green-600 font-data">
            {store.trustScore}%
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-dashed border-border-soft flex items-center justify-between gap-4">
        <span className="text-sm text-text-muted">{itemCount} items listed</span>
        <span className="material-symbols-outlined text-text-muted text-[18px]">arrow_forward</span>
      </div>
    </motion.div>
  );
};