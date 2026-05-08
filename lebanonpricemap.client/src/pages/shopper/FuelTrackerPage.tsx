import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFuelStore } from '@/store/useFuelStore';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { ReportRealityDialog } from '@/components/dialogs/ReportRealityDialog';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import type { FuelType } from '@/types';

const FUEL_TABS: { type: FuelType; label: string; short: string }[] = [
  { type: 'gasoline_95', label: 'Gasoline 95', short: '95' },
  { type: 'gasoline_98', label: 'Gasoline 98', short: '98' },
  { type: 'diesel',      label: 'Diesel',      short: 'DSL' },
];

function StockDot({ hasStock, isOpen }: { hasStock: boolean; isOpen: boolean }) {
  if (!isOpen)    return <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-500/20 shrink-0" />;
  if (!hasStock)  return <span className="w-2.5 h-2.5 rounded-full bg-red-400 ring-2 ring-red-400/20 shrink-0" />;
  return              <span className="w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-green-500/20 shrink-0" />;
}

export function FuelTrackerPage() {
  const [activeTab, setActiveTab] = useState<FuelType>('gasoline_95');

  const { stations, isLoading, fetchPrices, fetchStations, getPriceByType } = useFuelStore();
  const { rateLbpPerUsd } = useExchangeRateStore();
  const { open } = useRouteDialog();

  useEffect(() => {
    fetchPrices();
    fetchStations();
  }, []);

  const price = getPriceByType(activeTab);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-text-main">Fuel Tracker</h1>
        <p className="text-sm text-text-muted mt-1">Live station availability reported by the community.</p>
      </div>

      {/* Official price + fuel type selector */}
      <div className="bg-bg-surface border border-border-soft rounded-2xl overflow-hidden shadow-card">
        {/* Fuel type tabs */}
        <div className="flex border-b border-border-soft">
          {FUEL_TABS.map(tab => (
            <button
              key={tab.type}
              onClick={() => setActiveTab(tab.type)}
              className={cn(
                'flex-1 py-3 text-sm font-semibold transition-colors',
                activeTab === tab.type
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:text-text-main hover:bg-bg-muted/50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Official price display */}
        {price ? (
          <div className="px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-text-muted mb-1">Official price · per 20L</p>
              <p className="text-3xl font-bold text-text-main">
                {price.officialPriceLbp.toLocaleString()}
                <span className="text-base font-normal text-text-muted ml-1.5">LBP</span>
              </p>
              <p className="text-xs text-text-muted mt-1">
                ≈ ${(price.officialPriceLbp / rateLbpPerUsd).toFixed(2)} USD
                {price.effectiveTo && (
                  <> · Valid until {new Date(price.effectiveTo).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</>
                )}
              </p>
            </div>
            {price.reportedPriceLbp && price.reportedPriceLbp > price.officialPriceLbp && (
              <div className="shrink-0 text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  Higher price reported
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="px-6 py-5 text-sm text-text-muted">Price data unavailable.</div>
        )}
      </div>

      {/* How it works callout */}
      <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
        <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0">info</span>
        <p>
          Station statuses are reported by shoppers in real time.
          If you're at a station, tap <strong>I was just here</strong> to share its current availability with others.
        </p>
      </div>

      {/* Station list */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-text-main">
            Nearby stations
            {!isLoading && <span className="ml-1.5 text-text-muted font-normal">({stations.length})</span>}
          </h2>
          <button
            onClick={() => open('report-reality', { type: 'fuel' })}
            className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
          >
            <span className="material-symbols-outlined text-[14px]">add_location_alt</span>
            Add a station
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => <div key={i} className="h-28 rounded-2xl bg-bg-muted animate-pulse" />)}
          </div>
        ) : stations.length === 0 ? (
          <EmptyState
            icon="local_gas_station"
            title="No station reports yet"
            subtitle="Be the first to report availability at a nearby station."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {stations.map((station, i) => (
              <motion.div
                key={station.storeId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  'bg-bg-surface border rounded-2xl overflow-hidden shadow-card',
                  station.hasStock ? 'border-border-soft' : 'border-red-100'
                )}
              >
                {/* Card header */}
                <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <StockDot hasStock={station.hasStock} isOpen={station.isOpen} />
                    <div className="min-w-0">
                      <p className="font-bold text-text-main text-sm truncate">{station.storeName}</p>
                      <p className="text-[11px] text-text-muted">
                        {station.district ?? station.city}
                        {station.lastReportedAt && (
                          <> · reported {new Date(station.lastReportedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    'shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold',
                    station.hasStock
                      ? 'bg-green-50 text-green-700 border border-green-100'
                      : 'bg-red-50 text-red-600 border border-red-100'
                  )}>
                    {station.hasStock ? 'Has fuel' : 'Out of stock'}
                  </span>
                </div>

                {/* Stats row */}
                <div className="mx-5 mb-4 grid grid-cols-3 divide-x divide-border-soft bg-bg-muted/40 rounded-xl border border-border-soft">
                  <div className="px-3 py-2.5 text-center">
                    <p className="text-[10px] font-semibold text-text-muted mb-0.5">Wait</p>
                    <p className="text-sm font-bold text-text-main">{station.queueMinutes ?? 0} min</p>
                  </div>
                  <div className="px-3 py-2.5 text-center">
                    <p className="text-[10px] font-semibold text-text-muted mb-0.5">Queue</p>
                    <p className="text-sm font-bold text-text-main">~{station.queueDepth ?? 0} cars</p>
                  </div>
                  <div className="px-3 py-2.5 text-center">
                    <p className="text-[10px] font-semibold text-text-muted mb-0.5">Rationing</p>
                    <p className={cn('text-sm font-bold', station.isRationed ? 'text-amber-600' : 'text-text-main')}>
                      {station.isRationed ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                {/* Action */}
                <div className="px-5 pb-4">
                  <button
                    onClick={() => open('report-reality', { storeId: station.storeId, type: 'fuel' })}
                    className="w-full h-9 rounded-xl border border-border-soft text-xs font-semibold text-text-main hover:bg-bg-muted/60 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[15px] text-primary">where_to_vote</span>
                    I was just here — update status
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <ReportRealityDialog />
    </div>
  );
}
