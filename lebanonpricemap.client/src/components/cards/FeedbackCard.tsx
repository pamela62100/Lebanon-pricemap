import type { Feedback } from '@/types';
import { cn, timeAgo, getFeedbackIcon, getFeedbackLabel } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface FeedbackCardProps {
  feedback: Feedback;
  onResolve?: (id: string) => void;
}

export function FeedbackCard({ feedback, onResolve }: FeedbackCardProps) {
  return (
    <div className="flex gap-3 p-4 bg-bg-surface border border-border-soft rounded-xl">
      <span className="text-xl flex-shrink-0 mt-0.5">{getFeedbackIcon(feedback.type)}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-text-main">{getFeedbackLabel(feedback.type)}</span>
          <StatusBadge status={feedback.status} />
        </div>
        {feedback.note && (
          <p className="text-sm text-text-sub mb-2">{feedback.note}</p>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">
            by {feedback.submitter?.name || 'Anonymous'} · {timeAgo(feedback.createdAt)}
          </span>
          {onResolve && feedback.status !== 'resolved' && (
            <button
              onClick={() => onResolve(feedback.id)}
              className={cn(
                'ml-auto text-xs font-semibold px-3 py-1 rounded-full transition-colors',
                'bg-[var(--status-verified-bg)] text-[var(--status-verified-text)] hover:opacity-80'
              )}
            >
              Resolve
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
