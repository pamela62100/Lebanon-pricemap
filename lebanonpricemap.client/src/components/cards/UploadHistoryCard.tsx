
import type { PriceEntry } from '@/types';
import { formatLBP, timeAgo } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card } from './Card';

interface UploadHistoryCardProps {
  entry: PriceEntry;
}

export function UploadHistoryCard({ entry }: UploadHistoryCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-primary text-lg">receipt_long</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-text-main truncate">{entry.product?.name || 'Product'}</p>
          <StatusBadge status={entry.status} />
        </div>
        <p className="text-xs text-text-muted mt-0.5">
          {entry.store?.name} · {timeAgo(entry.createdAt)}
        </p>
      </div>
      <p className="text-sm font-bold text-primary flex-shrink-0">{formatLBP(entry.priceLbp)}</p>
    </Card>
  );
}