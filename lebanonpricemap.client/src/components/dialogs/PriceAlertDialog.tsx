import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LBPInput } from '@/components/ui/LBPInput';
import { cn } from '@/lib/utils';

interface PriceAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  currentAvgPrice: number;
  onSubmit: (data: { thresholdLbp: number; regions: string[]; verifiedOnly: boolean }) => void;
}

const REGIONS = ['Beirut', 'Mount Lebanon', 'North', 'South'];

export function PriceAlertDialog({ isOpen, onClose, productName, currentAvgPrice, onSubmit }: PriceAlertDialogProps) {
  const [threshold, setThreshold] = useState(0);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['Beirut']);
  const [verifiedOnly, setVerifiedOnly] = useState(true);

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const handleSubmit = () => {
    onSubmit({ thresholdLbp: threshold, regions: selectedRegions, verifiedOnly });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={onClose} />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-bg-surface rounded-t-3xl p-6 pb-8 max-w-lg mx-auto"
          >
            <div className="w-10 h-1 bg-border-soft rounded-full mx-auto mb-6" />
            <h2 className="text-xl font-bold text-text-main">Set Price Alert</h2>
            <p className="text-sm text-text-muted mt-1 mb-6">We'll notify you when the price drops</p>

            <div className="flex items-center gap-3 p-3 bg-bg-muted rounded-xl mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>shopping_bag</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-main">{productName}</p>
                <p className="text-xs text-primary">Current avg: LBP {currentAvgPrice.toLocaleString()}</p>
              </div>
            </div>

            <label className="block text-sm font-semibold text-text-sub mb-2">Alert Price (LBP)</label>
            <LBPInput value={threshold} onChange={setThreshold} placeholder="e.g. 95,000" />

            <label className="block text-sm font-semibold text-text-sub mb-2 mt-5">Select Region</label>
            <div className="flex flex-wrap gap-2 mb-5">
              {REGIONS.map(region => (
                <button
                  key={region}
                  onClick={() => toggleRegion(region)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium border transition-all',
                    selectedRegions.includes(region)
                      ? 'border-primary bg-primary text-white'
                      : 'border-border-soft bg-bg-surface text-text-sub hover:border-primary'
                  )}
                >
                  {region}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 bg-bg-muted rounded-xl mb-6">
              <div>
                <p className="text-sm font-semibold text-text-main">Verified Prices Only</p>
                <p className="text-xs text-text-muted">Only notify for store-verified price updates</p>
              </div>
              <button
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  verifiedOnly ? 'bg-primary' : 'bg-border-soft'
                )}
                role="switch" aria-checked={verifiedOnly}
              >
                <div className={cn(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                  verifiedOnly ? 'left-[22px]' : 'left-0.5'
                )} />
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 h-12 rounded-xl border border-border-soft text-text-sub font-semibold hover:bg-bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors">
                Set Alert
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
