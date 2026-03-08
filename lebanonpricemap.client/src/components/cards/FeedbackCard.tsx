import type { Feedback } from '@/types';
import { cn, timeAgo, getFeedbackIcon, getFeedbackLabel } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface FeedbackCardProps {
  feedback: Feedback;
  onResolve?: (id: string) => void;
}

export function FeedbackCard({ feedback, onResolve }: FeedbackCardProps) {
  return (
    <div className="flex gap-5 p-6 bg-bg-surface border border-text-main shadow-[4px_4px_0px_rgba(0,102,255,0.05)] transition-all hover:shadow-[6px_6px_0px_rgba(0,102,255,0.1)]">
      <span className="text-2xl flex-shrink-0">{getFeedbackIcon(feedback.type)}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-3 border-b border-border-soft pb-2">
          <span className="text-[11px] font-black text-text-main uppercase tracking-[0.2em]">{getFeedbackLabel(feedback.type)}</span>
          <StatusBadge status={feedback.status} />
        </div>
        {feedback.note && (
          <p className="font-serif text-lg font-bold text-text-main mb-4 leading-tight">{feedback.note}</p>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-dashed border-border-soft">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.3em]">
            SRC // {feedback.submitter?.name || 'ANONYMOUS'} • {timeAgo(feedback.createdAt)}
          </span>
          {onResolve && feedback.status !== 'resolved' && (
            <button
              onClick={() => onResolve(feedback.id)}
              className={cn(
                'text-[9px] font-black px-4 py-2 border uppercase tracking-widest transition-all',
                'bg-green-600 border-green-600 text-white shadow-[2px_2px_0px_rgba(0,0,0,0.1)] hover:bg-green-700'
              )}
            >
              FINALIZE_RESOLVE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
