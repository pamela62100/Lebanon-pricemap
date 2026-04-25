import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApprovalStore } from '@/store/useApprovalStore';
import { timeAgo } from '@/lib/utils';
import type { ApprovalRequest } from '@/types';
import { cn } from '@/lib/utils';
import { AdminCatalogReviewPanel } from '@/components/admin/AdminCatalogReviewPanel';

const STATUS_STYLES = {
  pending:  { bg: 'bg-amber-400/10 border-amber-400/30',  text: 'text-amber-500',  label: 'Pending Review' },
  approved: { bg: 'bg-green-500/10 border-green-500/30',  text: 'text-green-500',  label: 'Approved' },
  rejected: { bg: 'bg-red-500/10 border-red-500/30',      text: 'text-red-500',    label: 'Rejected' },
};

function tryParsePayload(payload: unknown): Record<string, unknown> {
  if (typeof payload === 'object' && payload !== null) return payload as Record<string, unknown>;
  try { return JSON.parse(payload as string) ?? {}; } catch { return {}; }
}

const TABS = ['All', 'Pending', 'Resolved'] as const;
type Tab = typeof TABS[number];

export function AdminApprovalQueuePage() {
  const { requests, approveRequest, rejectRequest, fetchAll } = useApprovalStore();
  const [activeTab, setActiveTab] = useState<Tab>('Pending');

  useEffect(() => { fetchAll(); }, []);
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (activeTab === 'Pending') return requests.filter(r => r.status === 'pending');
    if (activeTab === 'Resolved') return requests.filter(r => r.status !== 'pending');
    return requests;
  }, [requests, activeTab]);

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-amber-500" style={{ fontSize: '22px' }}>admin_panel_settings</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-main leading-none">Approval Queue</h1>
            <p className="text-sm text-text-muted mt-0.5">Review and act on user-requested actions</p>
          </div>
          {pendingCount > 0 && (
            <span className="ml-auto px-3 py-1 bg-amber-400/10 text-amber-500 border border-amber-400/30 rounded-full text-xs font-bold">
              {pendingCount} pending
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-bg-muted rounded-xl mb-6 w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
              activeTab === tab ? 'bg-bg-surface shadow-card text-text-main' : 'text-text-muted hover:text-text-sub'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Queue */}
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((request) => {
            const typedRequest = request as ApprovalRequest & { payload: string | Record<string, unknown> };
            return (
              <ApprovalCard
                key={request.id}
                request={typedRequest as ApprovalRequest}
                expanded={expandedId === request.id}
                onToggle={() => setExpandedId(id => id === request.id ? null : request.id)}
                reviewNote={reviewNote[request.id] ?? ''}
                onNoteChange={(note) => setReviewNote(n => ({ ...n, [request.id]: note }))}
                onApprove={() => { approveRequest(request.id, reviewNote[request.id]); setExpandedId(null); }}
                onReject={() =>  { rejectRequest(request.id, reviewNote[request.id]);  setExpandedId(null); }}
              />
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            <span className="material-symbols-outlined text-5xl block mb-3 opacity-20">task_alt</span>
            <p className="font-semibold">No requests here.</p>
          </div>
        )}
      </div>

      {/* ── Catalog Discrepancy Queue ─────────────────────────────── */}
      <AdminCatalogReviewPanel />
    </motion.div>
  );
}

// ─── Approval Card ────────────────────────────────────────────────────────────
function ApprovalCard({
  request,
  expanded,
  onToggle,
  reviewNote,
  onNoteChange,
  onApprove,
  onReject,
}: {
  request: ApprovalRequest;
  expanded: boolean;
  onToggle: () => void;
  reviewNote: string;
  onNoteChange: (note: string) => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const style = STATUS_STYLES[request.status as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.pending;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
      className={cn('rounded-2xl border p-5 transition-all', style.bg)}
    >
      {/* Header row */}
      <div className="flex items-start gap-4 cursor-pointer" onClick={onToggle}>
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
          {request.requester?.avatarInitials ?? '??'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-text-main text-sm">{request.requester?.name ?? request.requestedBy}</p>
            <span className="text-xs text-text-muted">·</span>
            <span className="text-xs text-text-muted">{timeAgo(request.createdAt)}</span>
            <span className={cn('ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border', style.bg, style.text)}>
              {style.label}
            </span>
          </div>
          <p className="text-sm font-semibold text-text-main mt-0.5">{request.label}</p>
          <p className="text-xs text-text-muted font-mono mt-0.5">{request.action}</p>
        </div>

        <span className={cn('material-symbols-outlined text-text-muted transition-transform', expanded && 'rotate-180')} style={{ fontSize: '18px' }}>
          expand_more
        </span>
      </div>

      {/* Expanded: Diff + Review */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-5 pt-5 border-t border-border-soft">
              {/* Side-by-side diff */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-4 bg-bg-muted rounded-xl border border-border-soft">
                  <p className="text-[10px] font-black uppercase text-text-muted tracking-widest mb-3">Current State</p>
                  <p className="text-sm text-text-sub">No changes applied yet.</p>
                </div>
                <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/20">
                  <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest mb-3">Proposed Change</p>
                  {Object.entries(tryParsePayload(request.payload)).filter(([k]) => k !== 'requestedBy').map(([k, v]) => (
                    <div key={k} className="flex gap-2 text-sm mb-1">
                      <span className="text-text-muted font-medium capitalize min-w-16">{k}:</span>
                      <span className="text-text-main font-semibold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolved Note */}
              {request.status !== 'pending' && request.reviewNote && (
                <div className="mb-4 p-3 bg-bg-surface border border-border-soft rounded-xl text-sm text-text-sub">
                  <span className="font-bold text-text-main">Admin Note:</span> {request.reviewNote}
                </div>
              )}

              {/* Actions — only for pending */}
              {request.status === 'pending' && (
                <div className="flex flex-col gap-3">
                  <textarea
                    value={reviewNote}
                    onChange={e => onNoteChange(e.target.value)}
                    placeholder="Add a note (optional)..."
                    className="w-full h-16 bg-bg-surface border border-border-soft rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/40 resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={onApprove}
                      className="flex-1 h-10 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
                      Approve
                    </button>
                    <button
                      onClick={onReject}
                      className="flex-1 h-10 border border-red-400/30 text-red-500 hover:bg-red-500/10 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>cancel</span>
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
