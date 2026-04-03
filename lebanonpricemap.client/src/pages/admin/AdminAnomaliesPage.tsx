import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/api/admin.api';

interface Anomaly {
  id: string;
  storeName: string;
  productName: string;
  oldPriceLbp: number;
  newPriceLbp: number;
  changePercent: number;
  severity: string;
  status: string;
  detectedAt: string;
}

const SEVERITY_STYLES: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-orange-100 text-orange-700',
  low: 'bg-yellow-100 text-yellow-700',
};

export function AdminAnomaliesPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi.getAnomalies('active')
      .then(res => {
        const data = (res as any).data?.data ?? [];
        setAnomalies(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-main">Price Anomaly Detection</h1>
          <p className="text-text-muted text-sm mt-1">Auto-detected price spikes showing ≥20% change in 24 hours</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-text-main">{anomalies.length}</p>
          <p className="text-xs text-text-muted">active anomalies</p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-2xl bg-bg-muted animate-pulse" />)}
        </div>
      ) : anomalies.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center gap-3 bg-bg-surface rounded-2xl border border-border-soft">
          <span className="material-symbols-outlined text-green-500" style={{ fontSize: '48px' }}>verified_user</span>
          <p className="text-base font-bold text-text-main">No anomalies detected</p>
          <p className="text-sm text-text-muted max-w-xs leading-relaxed">
            Price anomaly detection will flag unusual price spikes automatically as data accumulates.
          </p>
        </div>
      ) : (
        <div className="bg-bg-surface border border-border-soft rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-soft bg-bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Product</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Store</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Old Price</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">New Price</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Change</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Severity</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map(a => (
                <tr key={a.id} className="border-b border-bg-muted hover:bg-primary-soft/30 transition-colors">
                  <td className="py-4 px-4 text-sm font-semibold text-text-main">{a.productName}</td>
                  <td className="py-4 px-4 text-sm text-text-sub">{a.storeName}</td>
                  <td className="py-4 px-4 text-sm text-text-sub">{a.oldPriceLbp.toLocaleString()} LBP</td>
                  <td className="py-4 px-4 text-sm font-semibold text-text-main">{a.newPriceLbp.toLocaleString()} LBP</td>
                  <td className="py-4 px-4 text-sm font-bold text-red-600">+{a.changePercent.toFixed(1)}%</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${SEVERITY_STYLES[a.severity] ?? 'bg-bg-muted text-text-muted'}`}>
                      {a.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
