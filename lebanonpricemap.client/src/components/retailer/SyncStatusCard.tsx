import { cn } from '@/lib/utils';

interface SyncLog {
  id: string;
  method: 'manual' | 'csv' | 'api';
  time: string;
  records: number;
  status: 'success' | 'error';
  message?: string;
}

const MOCK_SYNC_LOGS: SyncLog[] = [
  { id: 'l1', method: 'api',    time: '2025-03-07T09:15:00Z', records: 47,  status: 'success' },
  { id: 'l2', method: 'api',    time: '2025-03-07T03:00:00Z', records: 51,  status: 'success' },
  { id: 'l3', method: 'csv',    time: '2025-03-06T14:30:00Z', records: 120, status: 'success' },
  { id: 'l4', method: 'api',    time: '2025-03-06T09:00:00Z', records: 0,   status: 'error', message: 'Authentication failed — check your API key' },
  { id: 'l5', method: 'manual', time: '2025-03-05T17:00:00Z', records: 3,   status: 'success' },
  { id: 'l6', method: 'api',    time: '2025-03-05T09:00:00Z', records: 49,  status: 'success' },
];

const METHOD_LABEL = { manual: 'Manual', csv: 'CSV Upload', api: 'API Sync' };
const METHOD_ICON  = { manual: 'edit', csv: 'upload_file', api: 'api' };

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface SyncStatusCardProps {
  className?: string;
}

export function SyncStatusCard({ className }: SyncStatusCardProps) {
  const last = MOCK_SYNC_LOGS[0];

  return (
    <div className={cn('flex flex-col gap-0', className)}>
      {/* Summary */}
      <div className="flex items-center gap-4 p-5 bg-bg-surface rounded-t-2xl border border-border-soft border-b-0">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center',
          last.status === 'success' ? 'bg-green-500/10' : 'bg-red-400/10'
        )}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: last.status === 'success' ? '#4ade80' : '#f87171' }}>
            {last.status === 'success' ? 'check_circle' : 'error'}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-text-main">Last sync: {timeAgo(last.time)}</p>
          <p className="text-xs text-text-muted mt-0.5">
            {METHOD_LABEL[last.method]} · {last.records} records
            {last.message && <span className="text-red-400 ml-1">— {last.message}</span>}
          </p>
        </div>
        <div className={cn('text-xs font-bold px-2.5 py-1 rounded-full border',
          last.status === 'success'
            ? 'bg-green-500/10 text-green-500 border-green-500/20'
            : 'bg-red-400/10 text-red-400 border-red-400/20'
        )}>
          {last.status === 'success' ? '✓ OK' : '✗ Error'}
        </div>
      </div>

      {/* Log table */}
      <div className="border border-border-soft rounded-b-2xl overflow-hidden">
        <div className="px-5 py-3 bg-bg-muted/50 border-b border-border-soft">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wide">Last 6 sync attempts</p>
        </div>
        <table className="w-full">
          <tbody>
            {MOCK_SYNC_LOGS.map(log => (
              <tr key={log.id} className="border-b border-border-soft last:border-0 hover:bg-bg-base/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '14px' }}>{METHOD_ICON[log.method]}</span>
                    <span className="text-xs font-semibold text-text-sub">{METHOD_LABEL[log.method]}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-text-muted">{timeAgo(log.time)}</td>
                <td className="px-4 py-3 text-xs text-text-main text-right">{log.records > 0 ? `${log.records} records` : '—'}</td>
                <td className="px-4 py-3 text-right">
                  <span className={cn('text-xs font-bold', log.status === 'success' ? 'text-green-500' : 'text-red-400')}>
                    {log.status === 'success' ? '✓ OK' : '✗ Fail'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
