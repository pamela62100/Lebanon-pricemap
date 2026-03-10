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
    <div className="max-w-4xl mx-auto px-5 py-12 md:py-20 flex flex-col gap-12">

      <header>
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">
          Fuel Market
        </p>

        <h1 className="text-5xl md:text-6xl font-bold text-text-main tracking-tighter leading-none">
          Fuel Prices & Station Status
        </h1>

        <p className="text-sm font-medium text-text-muted mt-4 opacity-70 max-w-xl leading-relaxed">
          View the official fuel price and see real-time updates shared by the community at nearby gas stations.
        </p>
      </header>

      {officialPrice && (
        <div
          className={cn(
  'card-dark p-10 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8',
  isHigherReportedPrice ? 'border-red-500/20' : undefined
)}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <path d="M0 50 C 30 70 70 30 100 50 L 100 100 L 0 100 Z" fill="currentColor" />
            </svg>
          </div>

          <div className="relative z-10 flex-1">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">
              Official Price / 20L
            </p>

            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-6xl md:text-7xl font-bold text-white tracking-tighter">
                {officialPrice.officialPriceLbp.toLocaleString()}
              </h2>

              <span className="text-lg font-bold text-white/40 uppercase tracking-widest">
                LBP
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-white/60 uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined opacity-40">
                  payments
                </span>
                Approx. value
                <span className="text-white">
                  ${(officialPrice.officialPriceLbp / rateLbpPerUsd).toFixed(2)}
                </span>
              </span>

              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined opacity-40">
                  calendar_month
                </span>
                Valid until{' '}
                {new Date(officialPrice.effectiveTo).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>
          </div>

          <div className="relative z-10">
            <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/10 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-5xl">
                local_gas_station
              </span>
            </div>
          </div>

          {isHigherReportedPrice && (
            <div className="absolute top-6 right-6 px-4 py-2 bg-red-500 text-white text-[9px] font-bold uppercase tracking-[0.15em] rounded-full">
              Higher reported price detected
            </div>
          )}
        </div>
      )}

      <div className="flex p-2 bg-bg-muted rounded-[2rem] gap-2">
        {(Object.keys(FUEL_LABELS) as FuelType[]).map((fuelType) => (
          <button
            key={fuelType}
            onClick={() => setActiveFuel(fuelType)}
            className={cn(
              'flex-1 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest transition-all',
              activeFuel === fuelType
                ? 'bg-text-main text-white'
                : 'text-text-muted hover:text-text-main hover:bg-white/50'
            )}
          >
            {FUEL_LABELS[fuelType]}
          </button>
        ))}
      </div>

      <section className="space-y-8">

        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
            Station Updates [{reports.length}]
          </h3>

          <button
            onClick={() => open('report-reality', { type: 'fuel' })}
            className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
          >
            Report Station Status
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: isStale ? 0.6 : 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'card p-8',
                  isHighConfidence && 'border-green-500/20 bg-green-500/5'
                )}
              >

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">

                  <div className="flex items-center gap-5">
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full ring-4',
                        report.isOpen && report.hasStock
                          ? 'bg-green-500 ring-green-500/10'
                          : !report.isOpen
                          ? 'bg-red-500 ring-red-500/10'
                          : 'bg-amber-400 ring-amber-400/10'
                      )}
                    />

                    <div>
                      <h4 className="text-xl font-bold text-text-main">
                        {report.store?.name ?? `Station ${report.storeId}`}
                      </h4>

                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1 opacity-60">
                        {report.store?.district} · {timeAgo(report.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">

                    <span
                      className={cn(
                        'px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest',
                        report.hasStock
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-red-500/10 text-red-500'
                      )}
                    >
                      {report.hasStock ? 'In Stock' : 'Out of Stock'}
                    </span>

                    {isHighConfidence && (
                      <div className="px-3 py-1.5 bg-text-main text-white rounded-full text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">
                          verified
                        </span>
                        Verified
                      </div>
                    )}
                  </div>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-bg-muted/30 rounded-2xl">

                  <div>
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest opacity-40">
                      Wait Time
                    </p>
                    <p className="text-lg font-bold text-text-main">
                      {report.queueMinutes ?? 0} min
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest opacity-40">
                      Queue Size
                    </p>
                    <p className="text-lg font-bold text-text-main">
                      ~{report.queueDepth ?? 0} cars
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest opacity-40">
                      Rationing
                    </p>
                    <p className={cn('text-lg font-bold', report.isRationed ? 'text-amber-600' : 'text-text-main')}>
                      {report.isRationed ? 'Yes' : 'No'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest opacity-40">
                      Confirmations
                    </p>
                    <p className="text-lg font-bold text-text-main">
                      {report.confirmedBy.length} reports
                    </p>
                  </div>

                </div>

                <div className="flex gap-4">

                  <button
                    onClick={() => confirmReport(report.id, 'current_user')}
                    className="flex-1 h-14 bg-white border border-border-soft rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-bg-muted flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined opacity-40">
                      priority_high
                    </span>
                    Confirm Update
                  </button>

                  <button
                    onClick={() =>
                      open('report-reality', {
                        storeId: report.storeId,
                        type: 'fuel',
                      })
                    }
                    className="flex-1 h-14 btn-primary rounded-2xl"
                  >
                    Add My Report
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
            subtitle={`The community hasn't shared any recent updates for ${FUEL_LABELS[activeFuel]}.`}
          />
        )}

      </section>

      <ReportRealityDialog />

    </div>
  );
}