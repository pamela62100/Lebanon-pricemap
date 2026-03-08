import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { PriceEntry } from '@/types';
import { cn, formatLBP, timeAgo, isOlderThan } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TrustBadge } from '@/components/ui/TrustBadge';

interface PriceResultCardProps {
  entry: PriceEntry;
  index?: number;
  onReport?: (id: string) => void;
  onFeedback?: (id: string, positive: boolean) => void;
}

export function PriceResultCard({ entry, index = 0, onReport, onFeedback }: PriceResultCardProps) {
  const navigate = useNavigate();
  const isOld = isOlderThan(entry.createdAt, 48);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className={cn(
        'relative bg-bg-surface border border-border-soft rounded-2xl p-5 shadow-sm',
        'hover:shadow-card transition-shadow'
      )}
    >
      {/* Promo ribbon */}
      {entry.isPromotion && (
        <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
          PROMO
        </div>
      )}

      {/* Store info */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-text-main">{entry.store?.name || 'Unknown Store'}</h3>
          <p className="flex items-center gap-1 text-sm text-text-muted mt-0.5">
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>location_on</span>
            {entry.store?.district}, {entry.store?.city}
          </p>
        </div>
        {entry.submitter && (
          <TrustBadge score={entry.submitter.trustScore} size="sm" />
        )}
      </div>

      {/* Product name */}
      <p className="text-sm text-text-sub mb-3">{entry.product?.name}</p>

      {/* Price & status row */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-2xl font-bold text-text-main">{formatLBP(entry.priceLbp)}</p>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mt-1">
            Updated {timeAgo(entry.createdAt)}
          </p>
        </div>
        <StatusBadge status={entry.status} />
      </div>

      {/* Old price prompt */}
      {isOld && entry.status === 'verified' && (
        <div className="flex items-center gap-2 mb-3 p-2.5 rounded-lg bg-accent-sand/50 dark:bg-[var(--status-pending-bg)]">
          <span className="text-sm">🤔</span>
          <p className="text-xs font-medium text-text-sub">Is this price still correct?</p>
          <div className="flex gap-1 ml-auto">
            <button
              onClick={() => onFeedback?.(entry.id, true)}
              className="w-7 h-7 rounded-full bg-[var(--status-verified-bg)] text-[var(--status-verified-text)] flex items-center justify-center text-sm hover:scale-110 transition-transform"
              aria-label="Confirm price"
            >
              👍
            </button>
            <button
              onClick={() => onFeedback?.(entry.id, false)}
              className="w-7 h-7 rounded-full bg-[var(--status-flagged-bg)] text-[var(--status-flagged-text)] flex items-center justify-center text-sm hover:scale-110 transition-transform"
              aria-label="Price is wrong"
            >
              👎
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-border-soft">
        <button
          onClick={() => navigate(`/app/price/${entry.id}`)}
          className="flex-1 h-10 rounded-lg bg-bg-muted text-text-sub text-sm font-bold hover:bg-border-soft transition-colors"
          aria-label="View price details"
        >
          View Details
        </button>
        {onReport && (
          <button
            onClick={() => onReport(entry.id)}
            className="h-10 w-10 rounded-lg border border-border-soft text-text-muted hover:text-[var(--status-flagged-text)] hover:border-[var(--status-flagged-text)] flex items-center justify-center transition-colors"
            aria-label="Report price"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>flag</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
