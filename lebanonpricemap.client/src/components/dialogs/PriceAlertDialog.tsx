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

export function PriceAlertDialog({
  isOpen,
  onClose,
  productName,
  currentAvgPrice,
  onSubmit,
}: PriceAlertDialogProps) {
  const [priceThresholdLbp, setPriceThresholdLbp] = useState(0);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['Beirut']);
  const [showVerifiedReportsOnly, setShowVerifiedReportsOnly] = useState(true);

  const toggleRegion = (region: string) => {
    setSelectedRegions((currentRegions) =>
      currentRegions.includes(region)
        ? currentRegions.filter((currentRegion) => currentRegion !== region)
        : [...currentRegions, region]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      thresholdLbp: priceThresholdLbp,
      regions: selectedRegions,
      verifiedOnly: showVerifiedReportsOnly,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4"
          >
            <div className="w-full max-w-lg rounded-3xl bg-bg-surface border border-border-primary shadow-glass overflow-hidden max-h-[92dvh] flex flex-col">
              <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-border-soft">
                <p className="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-2">
                  Price Alert
                </p>
                <h2 className="text-2xl font-black text-text-main">Track a better price</h2>
                <p className="text-sm text-text-muted mt-1">
                  Get notified when this product drops below your chosen price.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border-soft bg-bg-base/40">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[22px]">shopping_bag</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-text-main truncate">{productName}</p>
                    <p className="text-xs text-text-muted mt-1">
                      Current average:{' '}
                      <span className="font-bold text-text-main">
                        LBP {currentAvgPrice.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-2">
                    Alert me when the price reaches
                  </label>
                  <LBPInput
                    value={priceThresholdLbp}
                    onChange={(value) => setPriceThresholdLbp(value || 0)}
                    placeholder="e.g. 95,000"
                    className="h-12 rounded-2xl border-border-soft focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-2">
                    Regions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {REGIONS.map((region) => (
                      <button
                        key={region}
                        onClick={() => toggleRegion(region)}
                        className={cn(
                          'px-4 py-2 rounded-full border text-xs font-bold transition-all',
                          selectedRegions.includes(region)
                            ? 'border-primary bg-primary text-white'
                            : 'border-border-soft bg-bg-surface text-text-main hover:border-primary'
                        )}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-border-soft bg-bg-base/40">
                  <div>
                    <p className="text-sm font-bold text-text-main">Verified reports only</p>
                    <p className="text-xs text-text-muted">
                      Prioritize trusted and verified price updates.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowVerifiedReportsOnly(!showVerifiedReportsOnly)}
                    className={cn(
                      'relative w-12 h-7 rounded-full transition-all',
                      showVerifiedReportsOnly ? 'bg-primary' : 'bg-bg-muted border border-border-soft'
                    )}
                    role="switch"
                    aria-checked={showVerifiedReportsOnly}
                  >
                    <div
                      className={cn(
                        'absolute top-1 w-5 h-5 rounded-full bg-white transition-all',
                        showVerifiedReportsOnly ? 'right-1' : 'left-1'
                      )}
                    />
                  </button>
                </div>
              </div>

              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:flex-1 h-12 rounded-2xl border border-border-soft text-text-muted hover:bg-bg-muted hover:text-text-main transition-all font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="w-full sm:flex-1 h-12 rounded-2xl bg-primary text-white font-bold hover:opacity-90 transition-all"
                >
                  Save Alert
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}