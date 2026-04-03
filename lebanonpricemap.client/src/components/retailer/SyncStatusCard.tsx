import { useState, useEffect } from 'react';
import { storesApi } from '@/api/stores.api';
import { cn } from '@/lib/utils';

interface SyncRun {
  id: string;
  method: string;
  status: string;
  recordsReceived?: number;
  recordsProcessed?: number;
  recordsFailed?: number;
  message?: string;
  startedAt: string;
  finishedAt?: string;
}

interface SyncStatusCardProps {
  className?: string;
}

const STATUS_STYLES: Record<string, string> = {
  success: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  running: 'bg-blue-100 text-blue-700',
  partial: 'bg-yellow-100 text-yellow-700',
};

export function SyncStatusCard({ className }: SyncStatusCardProps) {
  const [runs, setRuns] = useState<SyncRun[]>([]);

  useEffect(() => {
    storesApi.getSyncRuns()
      .then(res => {
        const data = (res as any).data?.data ?? [];
        setRuns(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
  }, []);

  const latest = runs[0];

  return (
    <div className={cn('flex flex-col gap-0', className)}>
      {/* Summary */}
      <div className="flex items-center gap-4 p-5 bg-bg-surface rounded-t-2xl border border-border-soft border-b-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-bg-muted">
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>sync</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-text-main">Sync history</p>
          <p className="text-xs text-text-muted mt-0.5">
            {latest ? `Last sync: ${new Date(latest.startedAt).toLocaleDateString()}` : 'No syncs yet'}
          </p>
        </div>
        {latest && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLES[latest.status] ?? 'bg-bg-muted text-text-muted border-border-soft'}`}>
            {latest.status}
          </span>
        )}
        {!latest && (
          <div className="text-xs font-bold px-2.5 py-1 rounded-full border bg-bg-muted text-text-muted border-border-soft">
            Up to date
          </div>
        )}
      </div>

      {/* Runs list */}
      <div className="border border-border-soft rounded-b-2xl overflow-hidden">
        {runs.length === 0 ? (
          <div className="px-5 py-6 flex items-center gap-3 text-sm text-text-muted">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
            <span>Prices are updated manually through the catalog editor or CSV upload.</span>
          </div>
        ) : (
          runs.slice(0, 5).map((run, i) => (
            <div key={run.id} className={cn('px-5 py-3 flex items-center gap-4 text-sm', i < runs.length - 1 && 'border-b border-border-soft')}>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[run.status] ?? 'bg-bg-muted text-text-muted'}`}>
                {run.status}
              </span>
              <span className="text-text-sub">{run.method}</span>
              {run.recordsProcessed != null && (
                <span className="text-text-muted text-xs">{run.recordsProcessed} records</span>
              )}
              <span className="ml-auto text-xs text-text-muted">{new Date(run.startedAt).toLocaleDateString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
