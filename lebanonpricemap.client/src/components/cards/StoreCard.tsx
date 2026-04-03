import { useNavigate } from 'react-router-dom';
import type { Store } from '@/types';

interface StoreCardProps {
  store: Store;
  index: number;
}

export const StoreCard = ({ store }: StoreCardProps) => {
  const navigate = useNavigate();

  const initials = store.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="bg-white border border-border-soft rounded-2xl p-5 cursor-pointer hover:border-text-main/15 hover:shadow-sm transition-all duration-200 flex flex-col gap-4"
      onClick={() => navigate(`/app/catalog/${store.id}`)}
    >
      {/* Store identity */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-bg-muted flex items-center justify-center text-sm font-bold text-text-muted shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-text-main truncate">{store.name}</p>
            {store.isVerifiedRetailer && (
              <span className="material-symbols-outlined text-[14px] text-blue-500 shrink-0">verified</span>
            )}
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            {store.district}{store.city ? `, ${store.city}` : ''}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-border-soft">
        <div>
          <p className="text-xs text-text-muted mb-0.5">Store rate</p>
          <p className="text-sm font-bold text-text-main font-data">
            {store.internalRateLbp?.toLocaleString() ?? '—'} <span className="text-xs font-normal text-text-muted">LBP</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted mb-0.5">Trust</p>
          <p className="text-sm font-bold text-green-600">{store.trustScore}%</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-bg-muted flex items-center justify-center text-text-muted">
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </div>
      </div>
    </div>
  );
};
