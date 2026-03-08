import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFuelStore } from '@/store/useFuelStore';
import { MOCK_FUEL_PRICES } from '@/api/mockData';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { ReportRealityDialog } from '@/components/dialogs/ReportRealityDialog';
import { timeAgo, isOlderThan, formatLBP, cn } from '@/lib/utils';
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

  const reports = useMemo(() => getReportsByType(activeFuel), [activeFuel, getReportsByType]);
  const officialPrice = MOCK_FUEL_PRICES.find(p => p.fuelType === activeFuel);
  const isGouging = officialPrice?.reportedPriceLbp &&
    officialPrice.reportedPriceLbp > officialPrice.officialPriceLbp;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2">Fuel Tracker</p>
      <h1 className="font-sans text-4xl font-black text-text-main mb-2">Fuel Prices</h1>
      <p className="text-sm text-text-muted mb-8 pb-6 border-b border-border-primary">
        Official government pricing + community status reports
      </p>

      {/* Official Price Card */}
      {officialPrice && (
        <div className={cn(`rounded-2xl p-6 mb-6 border ${
          isGouging
            ? 'border-red-500/30 bg-red-500/5'
            : 'border-primary/30 bg-primary/10'
        }`)}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-3">
                Official Government Price / 20L
              </p>
              <p className="text-5xl font-black text-primary leading-none">
                {formatLBP(officialPrice.officialPriceLbp).replace(' LBP', '')}
                <span className="text-sm font-sans ml-2 font-bold">LBP</span>
              </p>
              <p className="text-sm text-text-muted mt-3">
                Est. Value: <span className="font-bold text-text-main">${(officialPrice.officialPriceLbp / rateLbpPerUsd).toFixed(2)}</span>
              </p>
            </div>
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '40px' }}>
              local_gas_station
            </span>
          </div>

          <p className="text-xs text-text-muted">
            {officialPrice.source} ·{' '}
            {new Date(officialPrice.effectiveFrom).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            {' – '}
            {new Date(officialPrice.effectiveTo).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </p>

          {isGouging && officialPrice.reportedPriceLbp && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm font-bold text-red-500">⚠️ Price Gouging Reported</p>
              <p className="text-xs text-red-400 mt-1">
                Stations charging {officialPrice.reportedPriceLbp.toLocaleString()} LBP —{' '}
                {(officialPrice.reportedPriceLbp - officialPrice.officialPriceLbp).toLocaleString()} LBP
                above official. Report stations doing this.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Fuel Type Tabs */}
      <div className="flex gap-2 mb-6 bg-bg-muted p-1 rounded-xl">
        {(Object.keys(FUEL_LABELS) as FuelType[]).map(type => (
          <button
            key={type}
            onClick={() => setActiveFuel(type)}
            className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${
              activeFuel === type
                ? 'bg-white shadow-sm text-primary'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            {FUEL_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Station Reports */}
      <h2 className="font-black text-text-main mb-4 text-sm uppercase tracking-wider">
        Station Status
        <span className="ml-2 text-xs font-normal text-text-muted normal-case tracking-normal">community reported</span>
      </h2>

      <div className="space-y-3">
        {reports.map((report, idx) => {
          const isStale = isOlderThan(report.createdAt, 4);
          const isHighConfidence = !isStale && report.confirmedBy.length >= 3;

          return (
            <motion.div
              key={report.id}
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: isStale ? 0.5 : 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-5 rounded-2xl border transition-colors ${
                isHighConfidence
                  ? 'border-green-500/40 bg-green-500/5'
                  : 'border-border-soft bg-bg-surface'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      report.isOpen && report.hasStock ? 'bg-green-500' :
                      !report.isOpen ? 'bg-red-500' : 'bg-amber-400'
                    }`} />
                    <h3 className="font-black text-base text-text-main">
                      {report.store?.name ?? `Station ${report.storeId}`}
                    </h3>
                  </div>
                  <p className="text-xs text-text-muted ml-5 mt-1">
                    {report.store?.district} · {timeAgo(report.createdAt)}
                    {isStale && <span className="text-amber-500 ml-2">(Data aging)</span>}
                  </p>
                </div>
                <div className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  report.hasStock
                    ? 'border-green-500/20 bg-green-500/10 text-green-600'
                    : 'border-red-500/20 bg-red-500/10 text-red-500'
                }`}>
                  {report.hasStock ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mb-5 ml-5">
                {report.queueMinutes !== undefined && report.queueMinutes > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-text-muted text-[18px]">hourglass_bottom</span>
                    <span className="text-xs font-bold text-text-main">{report.queueMinutes}m wait</span>
                    {report.queueDepth !== undefined && report.queueDepth > 0 && (
                      <span className="text-text-muted text-xs">(~{report.queueDepth} cars)</span>
                    )}
                  </div>
                )}
                {report.isRationed && (
                  <div className="flex items-center gap-2 text-amber-500">
                    <span className="material-symbols-outlined text-[18px]">repartition</span>
                    <span className="text-xs font-bold">
                      Limit: {report.limitAmountLbp ? formatLBP(report.limitAmountLbp).replace(' LBP', '') : 'Rationed'}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  <span className="text-xs font-bold text-primary">{report.confirmedBy.length} verifications</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => confirmReport(report.id, 'current_user')}
                  className="flex-1 py-3 bg-bg-base hover:bg-bg-muted border border-border-primary rounded-xl text-xs font-bold transition-all"
                >
                  Still Valid?
                </button>
                <button
                  onClick={() => open('report-reality', { storeId: report.storeId, type: 'fuel' })}
                  className="flex-1 py-3 bg-bg-base hover:bg-bg-muted border border-border-primary rounded-xl text-xs font-bold transition-all"
                >
                  Update Status
                </button>
              </div>
            </motion.div>
          );
        })}

        {reports.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <span className="text-4xl block mb-3">⛽</span>
            <p className="font-bold text-text-main">No reports yet for {FUEL_LABELS[activeFuel]}</p>
            <p className="text-sm mt-1">Be the first to report a station's status</p>
          </div>
        )}
      </div>
      <ReportRealityDialog />
    </div>
  );
}