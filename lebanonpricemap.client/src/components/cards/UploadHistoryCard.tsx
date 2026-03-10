import type { PriceEntry } from '@/types';
import { formatLBP, timeAgo } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card } from './Card';

interface UploadHistoryCardProps {
  entry: PriceEntry;
}

export function UploadHistoryCard({ entry }: UploadHistoryCardProps) {
  return (
    <Card className="p-0">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-lg">receipt_long</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-base font-semibold text-text-main truncate">
              {entry.product?.name || 'Product'}
            </p>
            <StatusBadge status={entry.status} />
          </div>

          <p className="text-sm text-text-muted mt-1">
            {entry.store?.name} • {timeAgo(entry.createdAt)}
          </p>
        </div>

        <p className="text-base font-semibold text-primary shrink-0">{formatLBP(entry.priceLbp)}</p>
      </div>
    </Card>
  );
}