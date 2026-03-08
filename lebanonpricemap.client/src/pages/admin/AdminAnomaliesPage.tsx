import { useState } from 'react';
import { motion } from 'framer-motion';
import { PriceSpikeAlert, type PriceSpike } from '@/components/admin/PriceSpikeAlert';
import { AnomalyTable } from '@/components/admin/AnomalyTable';
import { cn } from '@/lib/utils';

const MOCK_ANOMALIES: PriceSpike[] = [
  { id: 'an1', productName: 'Gasoline 95 Octane', storeName: 'Carrefour Dora',   district: 'Dora',       oldPrice: 121000, newPrice: 185000, pctChange: 52.9, detectedAt: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 'an2', productName: 'Diesel Fuel per Liter', storeName: 'TSC Dbayeh',   district: 'Dbayeh',     oldPrice: 105000, newPrice: 148000, pctChange: 41.0, detectedAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'an3', productName: 'Olive Oil 750ml',    storeName: 'Spinneys Achrafieh', district: 'Achrafieh', oldPrice: 315000, newPrice: 410000, pctChange: 30.2, detectedAt: new Date(Date.now() - 4 * 3600000).toISOString() },
  { id: 'an4', productName: 'Chicken per kg',     storeName: 'Bou Khalil Hamra', district: 'Hamra',      oldPrice: 178000, newPrice: 220000, pctChange: 23.6, detectedAt: new Date(Date.now() - 6 * 3600000).toISOString() },
  { id: 'an5', productName: 'Rice 5kg Bag',       storeName: 'Habib Market Gemmayzeh', district: 'Gemmayzeh', oldPrice: 290000, newPrice: 350000, pctChange: 20.7, detectedAt: new Date(Date.now() - 12 * 3600000).toISOString() },
];

const TIME_FILTERS = ['Today', 'This Week', 'This Month'];
const REGION_FILTERS = ['All Regions', 'Beirut', 'Metn', 'Keserwan'];

export function AdminAnomaliesPage() {
  const [anomalies, setAnomalies] = useState(MOCK_ANOMALIES);
  const [timeFilter, setTimeFilter] = useState('Today');
  const [regionFilter, setRegionFilter] = useState('All Regions');

  const dismiss = (id: string) => setAnomalies(prev => prev.filter(a => a.id !== id));
  const investigate = (id: string) => setAnomalies(prev => prev.filter(a => a.id !== id));

  const critical = anomalies.filter(a => a.pctChange >= 50);

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

      {/* Critical spikes */}
      {critical.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
          <p className="text-xs font-bold text-red-400 uppercase tracking-wide">🔥 Critical spikes — requires immediate review</p>
          {critical.map(spike => (
            <PriceSpikeAlert key={spike.id} spike={spike} onInvestigate={investigate} onDismiss={dismiss} />
          ))}
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-bg-surface border border-border-soft rounded-xl p-1">
          {TIME_FILTERS.map(f => (
            <button key={f} onClick={() => setTimeFilter(f)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                timeFilter === f ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main'
              )}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-bg-surface border border-border-soft rounded-xl p-1">
          {REGION_FILTERS.map(f => (
            <button key={f} onClick={() => setRegionFilter(f)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                regionFilter === f ? 'bg-primary text-white' : 'text-text-muted hover:text-text-main'
              )}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Full table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <AnomalyTable anomalies={anomalies} onDismiss={dismiss} onInvestigate={investigate} />
      </motion.div>
    </div>
  );
}
