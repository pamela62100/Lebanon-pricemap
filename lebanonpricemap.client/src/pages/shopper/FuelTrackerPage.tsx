import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useFuelStore } from '@/store/useFuelStore';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import type { FuelType } from '@/types';

const FUEL_TABS: { type: FuelType; label: string }[] = [
  { type: 'gasoline_95', label: 'Gasoline 95' },
  { type: 'gasoline_98', label: 'Gasoline 98' },
  { type: 'diesel',      label: 'Diesel' },
];

export function FuelTrackerPage() {
  const [activeTab, setActiveTab] = useState<FuelType>('gasoline_95');

  const { stations, isLoading, fetchPrices, fetchStations, getPriceByType } = useFuelStore();
  const { rateLbpPerUsd } = useExchangeRateStore();

  useEffect(() => {
    fetchPrices();
    fetchStations();
  }, []);

  const price = getPriceByType(activeTab);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">

      <div>
        <h1 className="text-2xl font-bold text-text-main">Fuel Prices</h1>
        <p className="text-sm text-text-muted mt-1">Official weekly prices set by the Ministry of Energy.</p>
      </div>

      {/* Official price card */}
      <div className="bg-bg-surface border border-border-soft rounded-2xl overflow-hidden shadow-card">
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

        <div className="px-6 py-6">
          {price ? (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-text-muted mb-1 uppercase tracking-wide">Price per 20L</p>
                <p className="text-4xl font-bold text-text-main">
                  {price.officialPriceLbp.toLocaleString()}
                  <span className="text-lg font-normal text-text-muted ml-2">LBP</span>
                </p>
                <p className="text-sm text-text-muted mt-2 flex items-center gap-3">
                  <span>≈ ${(price.officialPriceLbp / rateLbpPerUsd).toFixed(2)} USD</span>
                  {price.effectiveTo && (
                    <span className="text-text-muted/60">
                      Valid until {new Date(price.effectiveTo).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </p>
              </div>
              <span className="material-symbols-outlined text-primary/20 text-7xl">local_gas_station</span>
            </div>
          ) : (
            <p className="text-sm text-text-muted py-2">Price not yet available for this fuel type.</p>
          )}
        </div>
      </div>

      {/* Station directory */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-text-main">
          Stations
          {!isLoading && stations.length > 0 && (
            <span className="ml-1.5 text-text-muted font-normal">({stations.length})</span>
          )}
        </h2>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-16 rounded-xl bg-bg-muted animate-pulse" />)}
          </div>
        ) : stations.length === 0 ? (
          <EmptyState icon="local_gas_station" title="No stations listed yet" subtitle="" />
        ) : (
          <div className="bg-bg-surface border border-border-soft rounded-2xl overflow-hidden shadow-card divide-y divide-border-soft">
            {stations.map((station, i) => (
              <motion.div
                key={station.storeId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="px-5 py-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[16px]">local_gas_station</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-text-main text-sm truncate">{station.storeName}</p>
                    <p className="text-[11px] text-text-muted">{station.district ?? station.city}</p>
                  </div>
                </div>
                <span className="text-xs text-text-muted shrink-0">{station.city}</span>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
