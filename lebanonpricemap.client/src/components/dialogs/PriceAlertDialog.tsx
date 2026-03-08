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
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 20, opacity: 0 }}
            className="fixed inset-0 m-auto z-50 bg-bg-surface border border-text-main shadow-[12px_12px_0px_rgba(0,102,255,0.3)] max-w-lg w-full max-h-[90dvh] flex flex-col overflow-hidden"
          >
            {/* Fixed Header */}
            <div className="p-8 pb-6 border-b border-border-soft shrink-0">
              <span className="text-primary font-bold text-[10px] tracking-[0.4em] uppercase mb-4 block">SECURITY_PROTOCOL // PRICE_MONITOR</span>
              <h2 className="text-2xl font-serif font-black text-text-main uppercase tracking-tight">Set Price Alert</h2>
              <p className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-widest">Active surveillance initialization</p>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="flex items-center gap-4 p-4 border border-border-soft bg-bg-base/30 mb-8">
                <div className="w-12 h-12 bg-text-main flex items-center justify-center shadow-[2px_2px_0px_#0066FF]">
                  <span className="material-symbols-outlined text-bg-base" style={{ fontSize: '24px' }}>shopping_bag</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-text-main uppercase tracking-tight">{productName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">CURRENT_AVG:</span>
                    <span className="text-mono-data text-xs text-primary font-bold">LBP {currentAvgPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-text-muted mb-3 uppercase tracking-[0.2em]">Target Threshold (LBP)</label>
                  <LBPInput value={threshold} onChange={(val) => setThreshold(val || 0)} placeholder="e.g. 95,000" className="h-14 border-border-soft focus:border-primary text-xl font-serif" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-muted mb-3 uppercase tracking-[0.2em]">Operational Region</label>
                  <div className="flex flex-wrap gap-2">
                    {REGIONS.map(region => (
                      <button
                        key={region}
                        onClick={() => toggleRegion(region)}
                        className={cn(
                          'px-4 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all',
                          selectedRegions.includes(region)
                            ? 'border-text-main bg-text-main text-bg-base shadow-[2px_2px_0px_#0066FF]'
                            : 'border-border-soft bg-bg-surface text-text-sub hover:border-primary'
                        )}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-blue-500/20 bg-blue-500/5">
                  <div>
                    <p className="text-[10px] font-bold text-text-main uppercase tracking-widest mb-1">Verified Authority Only</p>
                    <p className="text-[9px] text-text-muted uppercase font-medium">Ignore unauthorized citizen reports</p>
                  </div>
                  <button
                    onClick={() => setVerifiedOnly(!verifiedOnly)}
                    className={cn(
                      'relative w-12 h-6 border transition-all',
                      verifiedOnly ? 'bg-primary border-primary' : 'bg-bg-muted border-border-soft'
                    )}
                    role="switch" aria-checked={verifiedOnly}
                  >
                    <div className={cn(
                      'absolute top-px w-[20px] h-[20px] transition-all',
                      verifiedOnly ? 'right-px bg-white' : 'left-px bg-text-muted'
                    )} />
                  </button>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-8 pt-6 border-t border-border-soft flex flex-col gap-2 shrink-0">
              <button 
                onClick={handleSubmit} 
                className="btn-consulate w-full h-14 bg-text-main text-bg-base border-text-main shadow-[3px_3px_0px_#0066FF]"
              >
                INITIALIZE_ALERT
              </button>
              <button 
                onClick={onClose} 
                className="btn-consulate btn-outline w-full h-14"
              >
                TERMINATE_SESSION
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
