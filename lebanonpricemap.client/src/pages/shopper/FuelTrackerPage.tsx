import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFuelStore } from '@/store/useFuelStore';
import { MOCK_FUEL_PRICES, MOCK_STORES } from '@/api/mockData';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { ReportRealityDialog } from '@/components/dialogs/ReportRealityDialog';
import { timeAgo, isOlderThan, formatLBP, cn } from '@/lib/utils';
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
    const raw = getReportsByType(activeFuel);
    return raw.map((r: any) => ({
      ...r,
      store: r.store || MOCK_STORES.find(s => s.id === r.storeId)
    }));
  }, [activeFuel, getReportsByType]);

  const officialPrice = MOCK_FUEL_PRICES.find(p => p.fuelType === activeFuel);
  const isGouging = officialPrice?.reportedPriceLbp &&
    officialPrice.reportedPriceLbp > officialPrice.officialPriceLbp;

  return (
    <div className="max-w-4xl mx-auto px-5 py-12 md:py-20 animate-page flex flex-col gap-12">
      <header>
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">Market_Logistics</p>
        <h1 className="text-5xl md:text-6xl font-bold text-text-main tracking-tighter leading-none">Fuel_Intelligence.</h1>
        <p className="text-sm font-medium text-text-muted mt-4 opacity-60 max-w-xl leading-relaxed">
          Official government pricing parity coupled with community-vetted station status reports.
        </p>
      </header>

      {/* Official Price Card (Dark Hero) */}
      {officialPrice && (
        <div className={cn(
          "card-dark p-10 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8",
          isGouging ? "border-red-500/20" : ""
        )}>
          {/* Abstract SVG Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 50 C 30 70 70 30 100 50 L 100 100 L 0 100 Z" fill="currentColor" />
            </svg>
          </div>

          <div className="relative z-10 flex-1">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Official Protocol / 20L</p>
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-6xl md:text-7xl font-bold text-white tracking-tighter font-data">
                {officialPrice.officialPriceLbp.toLocaleString()}
              </h2>
              <span className="text-lg font-bold text-white/40 uppercase tracking-widest">LBP</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-white/60 uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg opacity-40">payments</span>
                Est. Value: <span className="text-white">${(officialPrice.officialPriceLbp / rateLbpPerUsd).toFixed(2)}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg opacity-40">calendar_month</span>
                Until {new Date(officialPrice.effectiveTo).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
             <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white shadow-2xl">
                <span className="material-symbols-outlined text-5xl">local_gas_station</span>
             </div>
          </div>

          {isGouging && (
            <div className="absolute top-6 right-6 px-4 py-2 bg-red-500 text-white text-[9px] font-bold uppercase tracking-[0.15em] rounded-full shadow-lg animate-pulse">
              Protocol_Deviation Reported
            </div>
          )}
        </div>
      )}

      {/* Fuel Type Navigation */}
      <div className="flex p-2 bg-bg-muted rounded-[2rem] gap-2">
        {(Object.keys(FUEL_LABELS) as FuelType[]).map(type => (
          <button
            key={type}
            onClick={() => setActiveFuel(type)}
            className={cn(
              "flex-1 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
              activeFuel === type 
                ? "bg-text-main text-white shadow-xl shadow-text-main/10 scale-[1.02]" 
                : "text-text-muted hover:text-text-main hover:bg-white/50"
            )}
          >
            {FUEL_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Station Reports section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
           <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Active_Nodes [{reports.length}]</h3>
           <button 
             onClick={() => open('report-reality', { type: 'fuel' })}
             className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
           >
             Broadcast_Status
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {reports.map((report, idx) => {
            const isStale = isOlderThan(report.createdAt, 4);
            const isHighConfidence = !isStale && report.confirmedBy.length >= 3;

            return (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: isStale ? 0.6 : 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "card p-8 group transition-all duration-500",
                  isHighConfidence && "border-green-500/20 bg-green-500/5"
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-4 h-4 rounded-full ring-4",
                      report.isOpen && report.hasStock ? "bg-green-500 ring-green-500/10" :
                      !report.isOpen ? "bg-red-500 ring-red-500/10" : "bg-amber-400 ring-amber-400/10"
                    )} />
                    <div>
                      <h4 className="text-xl font-bold text-text-main tracking-tight group-hover:text-primary transition-colors">
                        {report.store?.name ?? `Node_${report.storeId}`}
                      </h4>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1 opacity-60">
                        {report.store?.district} · {timeAgo(report.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                     <span className={cn(
                       "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest",
                       report.hasStock ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
                     )}>
                       {report.hasStock ? 'Signal: In_Stock' : 'Signal: Depleted'}
                     </span>
                     {isHighConfidence && (
                        <div className="px-3 py-1.5 bg-text-main text-white rounded-full text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                           <span className="material-symbols-outlined text-[10px]">verified</span> Validated
                        </div>
                     )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-bg-muted/30 rounded-2xl">
                   <div className="space-y-1">
                      <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest opacity-40">Wait_Protocol</p>
                      <p className="text-lg font-bold text-text-main font-data">
                        {report.queueMinutes ?? 0}<span className="text-[10px] ml-1">min</span>
                      </p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest opacity-40">Node_Capacity</p>
                      <p className="text-lg font-bold text-text-main font-data">
                        ~{report.queueDepth ?? 0}<span className="text-[10px] ml-1">cars</span>
                      </p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest opacity-40">Ration_Status</p>
                      <p className={cn("text-lg font-bold font-data", report.isRationed ? "text-amber-600" : "text-text-main")}>
                        {report.isRationed ? 'Active' : 'Unrestricted'}
                      </p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest opacity-40">Confidence</p>
                      <p className="text-lg font-bold text-text-main font-data">
                        {report.confirmedBy.length}<span className="text-[10px] ml-1">signals</span>
                      </p>
                   </div>
                </div>

                <div className="flex gap-4">
                   <button
                    onClick={() => confirmReport(report.id, 'current_user')}
                    className="flex-1 h-14 bg-white border border-border-soft rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-bg-muted transition-all flex items-center justify-center gap-2 group/btn"
                   >
                     <span className="material-symbols-outlined text-lg opacity-40 group-hover/btn:scale-110 transition-transform">priority_high</span>
                     Still_Operational?
                   </button>
                   <button
                    onClick={() => open('report-reality', { storeId: report.storeId, type: 'fuel' })}
                    className="flex-1 h-14 btn-primary rounded-2xl"
                   >
                      Contribute Data
                   </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {reports.length === 0 && (
          <EmptyState 
           icon="local_gas_station" 
           title="No Active Signals" 
           subtitle={`The community hasn't broadcasted any recent status reports for ${FUEL_LABELS[activeFuel]} at this time.`}
          />
        )}
      </section>

      <ReportRealityDialog />
    </div>
  );
}