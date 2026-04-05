import type { Feedback } from '@/types';
import { cn, timeAgo, getFeedbackIcon, getFeedbackLabel } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card } from './Card';

interface FeedbackCardProps {
  feedback: Feedback;
  onResolve?: (id: string) => void;
}

export function FeedbackCard({ feedback, onResolve }: FeedbackCardProps) {
  return (
    <Card className="p-0">
      <div className="flex gap-4 sm:gap-5">
        <div className="w-12 h-12 rounded-2xl bg-bg-muted flex items-center justify-center shrink-0 text-2xl">
          {getFeedbackIcon(feedback.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-border-soft flex-wrap">
            <span className="text-xs font-bold text-text-main tracking-wide">
              {getFeedbackLabel(feedback.type)}
            </span>
            <StatusBadge status={feedback.status} />
          </div>

          {feedback.note ? (
            <p className="text-base sm:text-lg font-semibold text-text-main mb-4 leading-relaxed">
              {feedback.note}
            </p>
          ) : (
            <p className="text-sm text-text-muted mb-4">No additional details were provided.</p>
          )}

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-dashed border-border-soft flex-wrap">
            <span className="text-xs text-text-muted">
              {timeAgo(feedback.createdAt)}
            </span>

            {onResolve && feedback.status !== 'resolved' ? (
              <button
                onClick={() => onResolve(feedback.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-semibold transition-all',
                  'bg-green-600 text-white hover:bg-green-700'
                )}
                type="button"
              >
                Mark as resolved
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}