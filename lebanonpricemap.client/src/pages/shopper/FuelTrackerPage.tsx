import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFuelStore } from '@/store/useFuelStore';
import { MOCK_FUEL_PRICES, MOCK_STORES } from '@/api/mockData';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { ReportRealityDialog } from '@/components/dialogs/ReportRealityDialog';
import { timeAgo, isOlderThan, cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import type { FuelType } from '@/types';

const FUEL_LABELS: Record<FuelType, string> = {
  gasoline_95: 'Gasoline 95',
  gasoline_98: 'Gasoline 98',
  diesel: 'Diesel',
};

function formatPowerStatus(status: string): string {
  const map: Record<string, string> = {
    stable: 'Stable',
    outage: 'Outage',
    reported_warm: 'Warm reported',
    intermittent: 'Intermittent',
  };
  return map[status] ?? status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function FuelTrackerPage() {
  const [activeFuel, setActiveFuel] = useState<FuelType>('gasoline_95');

  const { getReportsByType, confirmReport } = useFuelStore();
  const { rateLbpPerUsd } = useExchangeRateStore();
  const { open } = useRouteDialog();

  const reports = useMemo(() => {
    const rawReports = getReportsByType(activeFuel);
    return rawReports.map((report: any) => ({
      ...report,
      store: report.store || MOCK_STORES.find((s) => s.id === report.storeId),
    }));
  }, [activeFuel, getReportsByType]);

  const officialPrice = MOCK_FUEL_PRICES.find((p) => p.fuelType === activeFuel);

  const isHigherReportedPrice =
    officialPrice?.reportedPriceLbp &&
    officialPrice.reportedPriceLbp > officialPrice.officialPriceLbp;

  return (
    <div className="max-w-4xl mx-auto px-5 py-12 md:py-20 flex flex-col gap-10">

      {/* Header */}
      <header>
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-3">
          Live fuel tracker
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-text-main tracking-tight leading-tight">
          Fuel prices &amp; <br /> station status
        </h1>
        <p className="text-sm text-text-muted mt-3 max-w-xl leading-relaxed">
          Official fuel prices plus real-time updates from the community at nearby stations.
        </p>
      </header>

      {/* Official price card */}
      {officialPrice && (
        <div
          className={cn(
            'card-dark p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8',
            isHigherReportedPrice ? 'border-red-500/20' : undefined
          )}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <path d="M0 50 C 30 70 70 30 100 50 L 100 100 L 0 100 Z" fill="currentColor" />
            </svg>
          </div>

          <div className="relative z-10 flex-1">
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">
              Official price · per 20L
            </p>

            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                {officialPrice.officialPriceLbp.toLocaleString()}
              </h2>
              <span className="text-base font-bold text-white/40 uppercase tracking-wide">LBP</span>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-[11px] font-semibold text-white/60">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm opacity-40">payments</span>
                ≈ ${(officialPrice.officialPriceLbp / rateLbpPerUsd).toFixed(2)}
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm opacity-40">calendar_month</span>
                Valid until{' '}
                {new Date(officialPrice.effectiveTo).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-4xl">local_gas_station</span>
            </div>
          </div>

          {isHigherReportedPrice && (
            <div className="absolute top-5 right-5 px-3 py-1.5 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wide rounded-full">
              Higher price reported nearby
            </div>
          )}
        </div>
      )}

      {/* Fuel type tabs */}
      <div className="flex p-1.5 bg-bg-muted rounded-2xl gap-1.5">
        {(Object.keys(FUEL_LABELS) as FuelType[]).map((fuelType) => (
          <button
            key={fuelType}
            onClick={() => setActiveFuel(fuelType)}
            className={cn(
              'flex-1 py-3 rounded-xl text-xs font-semibold transition-all',
              activeFuel === fuelType
                ? 'bg-text-main text-white shadow-sm'
                : 'text-text-muted hover:text-text-main hover:bg-white/50'
            )}
          >
            {FUEL_LABELS[fuelType]}
          </button>
        ))}
      </div>

      {/* Station reports */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-main">
            Station updates
            <span className="ml-2 text-text-muted font-normal">({reports.length})</span>
          </h3>
          <button
            onClick={() => open('report-reality', { type: 'fuel' })}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Report a station
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {reports.map((report, index) => {
            const isStale = isOlderThan(report.createdAt, 4);
            const isHighConfidence = !isStale && report.confirmedBy.length >= 3;

            return (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isStale ? 0.55 : 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'card p-6',
                  isHighConfidence && 'border-green-500/20 bg-green-500/5'
                )}
              >
                {/* Station header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full ring-4 shrink-0',
                        report.isOpen && report.hasStock
                          ? 'bg-green-500 ring-green-500/15'
                          : !report.isOpen
                          ? 'bg-red-500 ring-red-500/15'
                          : 'bg-amber-400 ring-amber-400/15'
                      )}
                    />
                    <div>
                      <h4 className="text-base font-bold text-text-main">
                        {report.store?.name ?? `Station ${report.storeId}`}
                      </h4>
                      <p className="text-xs text-text-muted mt-0.5">
                        {report.store?.district} · {timeAgo(report.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-[11px] font-semibold',
                        report.hasStock
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      )}
                    >
                      {report.hasStock ? 'In stock' : 'Out of stock'}
                    </span>

                    {isHighConfidence && (
                      <span className="px-3 py-1 bg-text-main text-white rounded-full text-[10px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[11px]">verified</span>
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 p-4 bg-bg-muted/30 rounded-xl">
                  <div>
                    <p className="text-[10px] font-semibold text-text-muted mb-0.5">Wait time</p>
                    <p className="text-base font-bold text-text-main">{report.queueMinutes ?? 0} min</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-text-muted mb-0.5">Queue</p>
                    <p className="text-base font-bold text-text-main">~{report.queueDepth ?? 0} cars</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-text-muted mb-0.5">Rationing</p>
                    <p className={cn('text-base font-bold', report.isRationed ? 'text-amber-600' : 'text-text-main')}>
                      {report.isRationed ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-text-muted mb-0.5">Confirmations</p>
                    <p className="text-base font-bold text-text-main">{report.confirmedBy.length}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => confirmReport(report.id, 'current_user')}
                    className="flex-1 h-11 bg-white border border-border-soft rounded-xl text-xs font-semibold hover:bg-bg-muted flex items-center justify-center gap-2 transition-all"
                  >
                    <span className="material-symbols-outlined text-base opacity-40">thumb_up</span>
                    Confirm this report
                  </button>
                  <button
                    onClick={() => open('report-reality', { storeId: report.storeId, type: 'fuel' })}
                    className="flex-1 h-11 btn-primary rounded-xl text-xs font-semibold"
                  >
                    Add my update
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {reports.length === 0 && (
          <EmptyState
            icon="local_gas_station"
            title="No station updates yet"
            subtitle={`No one has reported on ${FUEL_LABELS[activeFuel]} availability recently. Be the first!`}
          />
        )}
      </section>

      <ReportRealityDialog />
    </div>
  );
}