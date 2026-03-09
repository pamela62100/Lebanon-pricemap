import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { discrepancyApi, missingProductApi } from '@/api/catalog.api';
import type { PriceDiscrepancyReport, MissingProductRequest } from '@/types/catalog.types';
import { cn, timeAgo } from '@/lib/utils';

const DISC_STATUS_STYLES = {
  pending:    { bg: 'bg-amber-400/10 border-amber-400/30',  text: 'text-amber-500',  label: 'Pending' },
  approved:   { bg: 'bg-green-500/10 border-green-500/30',  text: 'text-green-500',  label: 'Approved' },
  rejected:   { bg: 'bg-red-500/10 border-red-500/30',      text: 'text-red-500',    label: 'Rejected' },
  needs_info: { bg: 'bg-blue-500/10 border-blue-500/30',    text: 'text-blue-500',   label: 'Needs Info' },
  auto_closed:{ bg: 'bg-bg-muted border-border-soft',       text: 'text-text-muted', label: 'Auto-Closed' },
};

const DISC_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  price_higher:      { label: 'Price Higher',     icon: 'trending_up' },
  price_lower:       { label: 'Price Lower',      icon: 'trending_down' },
  out_of_stock:      { label: 'Out of Stock',     icon: 'remove_shopping_cart' },
  product_removed:   { label: 'Product Removed',  icon: 'delete_sweep' },
  wrong_unit:        { label: 'Wrong Unit',        icon: 'straighten' },
  duplicate_listing: { label: 'Duplicate',         icon: 'content_copy' },
};

const MISS_STATUS_STYLES = {
  pending:   { bg: 'bg-amber-400/10 border-amber-400/30', text: 'text-amber-500',  label: 'Pending' },
  forwarded: { bg: 'bg-blue-500/10 border-blue-500/30',   text: 'text-blue-500',   label: 'Forwarded' },
  added:     { bg: 'bg-green-500/10 border-green-500/30', text: 'text-green-500',  label: 'Added' },
  declined:  { bg: 'bg-red-500/10 border-red-500/30',     text: 'text-red-500',    label: 'Declined' },
  rejected:  { bg: 'bg-red-500/10 border-red-500/30',     text: 'text-red-500',    label: 'Rejected' },
};

const TABS = ['Discrepancy Reports', 'Missing Products'] as const;
type Tab = typeof TABS[number];

export function AdminCatalogReviewPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('Discrepancy Reports');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({});
  const [newPrice, setNewPrice] = useState<Record<string, string>>({});

  // These re-read from the in-memory store each render
  const discrepancies = useMemo(() => discrepancyApi.getAll(), []);
  const missingRequests = useMemo(() => missingProductApi.getAll(), []);

  const pendingDiscCount = discrepancies.filter(d => d.status === 'pending').length;
  const pendingMissCount = missingRequests.filter(m => m.status === 'pending').length;

  return (
    <div className="mt-12 pt-8 border-t border-border-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>rate_review</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-main leading-none">Catalog Discrepancy Queue</h2>
          <p className="text-xs text-text-muted mt-0.5">Community-reported pricing issues. Sorted by reporter trust score.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-bg-muted rounded-xl mb-6 w-fit">
        {TABS.map(tab => {
          const count = tab === 'Discrepancy Reports' ? pendingDiscCount : pendingMissCount;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2',
                activeTab === tab ? 'bg-bg-surface shadow-card text-text-main' : 'text-text-muted hover:text-text-sub'
              )}
            >
              {tab}
              {count > 0 && (
                <span className="px-1.5 py-0.5 bg-amber-400/20 text-amber-500 rounded-full text-[9px] font-black">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Discrepancy Reports */}
      {activeTab === 'Discrepancy Reports' && (
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {discrepancies.map(report => {
              const style = DISC_STATUS_STYLES[report.status];
              const typeInfo = DISC_TYPE_LABELS[report.reportType] ?? { label: report.reportType, icon: 'flag' };
              const expanded = expandedId === report.id;
              return (
                <motion.div
                  key={report.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className={cn('rounded-2xl border p-5 transition-all', style.bg)}
                >
                  {/* Header row */}
                  <div className="flex items-start gap-4 cursor-pointer" onClick={() => setExpandedId(id => id === report.id ? null : report.id)}>
                    {/* Reporter badge */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[11px] font-black">
                        {report.reporter?.avatarInitials ?? '??'}
                      </div>
                      <div className={cn(
                        'w-8 h-1 rounded-full',
                        (report.reporterTrustScore ?? 0) > 80 ? 'bg-green-500' :
                        (report.reporterTrustScore ?? 0) > 50 ? 'bg-amber-400' : 'bg-red-400'
                      )} />
                      <span className="text-[8px] font-black text-text-muted">{report.reporterTrustScore}%</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold text-text-main text-sm">{report.reporter?.name ?? report.reportedBy}</p>
                        <span className="text-xs text-text-muted">·</span>
                        <span className="text-xs text-text-muted">{timeAgo(report.createdAt)}</span>
                        <span className={cn('ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border', style.bg, style.text)}>
                          {style.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-sub font-medium">
                        <span className="material-symbols-outlined text-[14px]">{typeInfo.icon}</span>
                        <span className="font-bold">{typeInfo.label}</span>
                        <span className="opacity-40">·</span>
                        <span className="text-text-muted font-mono text-[10px]">
                          Store: {report.storeId} / Product: {report.productId}
                        </span>
                      </div>
                      {report.observedPriceLbp && (
                        <p className="text-xs mt-1 text-text-main font-bold">
                          Reported: LBP {report.observedPriceLbp.toLocaleString()}
                        </p>
                      )}
                      {report.note && (
                        <p className="text-xs mt-1 text-text-muted italic">"{report.note}"</p>
                      )}
                    </div>

                    <span className={cn('material-symbols-outlined text-text-muted transition-transform shrink-0', expanded && 'rotate-180')} style={{ fontSize: '18px' }}>
                      expand_more
                    </span>
                  </div>

                  {/* Expanded panel */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 pt-5 border-t border-border-soft">
                          {report.status !== 'pending' ? (
                            <div className="p-3 rounded-xl bg-bg-surface border border-border-soft text-sm">
                              <span className="font-bold text-text-main">Admin Note: </span>
                              <span className="text-text-sub">{report.reviewNote ?? 'No note.'}</span>
                              {report.approvedNewPriceLbp && (
                                <p className="mt-1 text-xs font-bold text-green-500">
                                  New catalog price set: LBP {report.approvedNewPriceLbp.toLocaleString()}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col gap-3">
                              {(report.reportType === 'price_higher' || report.reportType === 'price_lower') && (
                                <div>
                                  <label className="text-[10px] font-black uppercase text-text-muted tracking-widest block mb-1.5">New catalog price (LBP)</label>
                                  <input
                                    type="number"
                                    placeholder={`e.g. ${report.observedPriceLbp ?? ''}`}
                                    value={newPrice[report.id] ?? ''}
                                    onChange={e => setNewPrice(n => ({ ...n, [report.id]: e.target.value }))}
                                    className="w-full h-10 bg-bg-surface border border-border-soft rounded-xl px-4 text-sm font-bold outline-none focus:border-primary/40"
                                  />
                                </div>
                              )}
                              <textarea
                                value={reviewNote[report.id] ?? ''}
                                onChange={e => setReviewNote(n => ({ ...n, [report.id]: e.target.value }))}
                                placeholder="Review note (optional)..."
                                className="w-full h-16 bg-bg-surface border border-border-soft rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/40 resize-none"
                              />
                              <div className="flex gap-3">
                                <button
                                  onClick={() => {
                                    discrepancyApi.approve(report.id, reviewNote[report.id], newPrice[report.id] ? parseInt(newPrice[report.id]) : undefined);
                                    setExpandedId(null);
                                  }}
                                  className="flex-1 h-10 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
                                  Approve {newPrice[report.id] ? '& Update Catalog' : ''}
                                </button>
                                <button
                                  onClick={() => {
                                    discrepancyApi.reject(report.id, reviewNote[report.id] ?? 'Rejected.');
                                    setExpandedId(null);
                                  }}
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
            })}
          </AnimatePresence>

          {discrepancies.length === 0 && (
            <div className="text-center py-12 text-text-muted">
              <span className="material-symbols-outlined text-5xl block mb-3 opacity-20">task_alt</span>
              <p className="font-semibold">No discrepancy reports.</p>
            </div>
          )}
        </div>
      )}

      {/* Missing Product Requests */}
      {activeTab === 'Missing Products' && (
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {missingRequests.map(req => {
              const style = MISS_STATUS_STYLES[req.status];
              const expanded = expandedId === req.id;
              return (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className={cn('rounded-2xl border p-5 transition-all', style.bg)}
                >
                  <div className="flex items-start gap-4 cursor-pointer" onClick={() => setExpandedId(id => id === req.id ? null : req.id)}>
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[11px] font-black shrink-0">
                      {req.requestedBy.slice(-2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-text-main text-sm">{req.requestedBy}</p>
                        <span className="text-xs text-text-muted">· {timeAgo(req.createdAt)}</span>
                        <span className={cn('ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border', style.bg, style.text)}>
                          {style.label}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-text-main">
                        {req.productNameFreeText ?? req.productId}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">Store: {req.storeId}</p>
                      {req.note && <p className="text-xs mt-1 text-text-muted italic">"{req.note}"</p>}
                    </div>
                    <span className={cn('material-symbols-outlined text-text-muted transition-transform shrink-0', expanded && 'rotate-180')} style={{ fontSize: '18px' }}>
                      expand_more
                    </span>
                  </div>

                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 pt-5 border-t border-border-soft">
                          {req.status !== 'pending' ? (
                            <div className="p-3 rounded-xl bg-bg-surface border border-border-soft text-sm text-text-sub">
                              <span className="font-bold text-text-main">Admin Note: </span>
                              {req.reviewNote ?? 'No note.'}
                            </div>
                          ) : (
                            <div className="flex gap-3">
                              <button
                                onClick={() => { missingProductApi.forward(req.id, 'Forwarded to store owner.'); setExpandedId(null); }}
                                className="flex-1 h-10 bg-primary hover:opacity-90 text-white rounded-xl text-sm font-bold transition-all"
                              >
                                Forward to Owner
                              </button>
                              <button
                                onClick={() => { missingProductApi.decline(req.id, 'Outside catalog scope.'); setExpandedId(null); }}
                                className="flex-1 h-10 border border-border-primary text-text-sub hover:border-red-400/30 hover:text-red-500 rounded-xl text-sm font-bold transition-all"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {missingRequests.length === 0 && (
            <div className="text-center py-12 text-text-muted">
              <span className="material-symbols-outlined text-5xl block mb-3 opacity-20">category</span>
              <p className="font-semibold">No missing product requests.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
