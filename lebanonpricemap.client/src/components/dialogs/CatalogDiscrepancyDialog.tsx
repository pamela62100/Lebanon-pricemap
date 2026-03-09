import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CatalogProduct } from '@/types/catalog.types';
import { catalogApi } from '@/api/catalog.api';
import { cn } from '@/lib/utils';

interface CatalogDiscrepancyDialogProps {
  product: CatalogProduct;
  storeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

type DiscrepancyType = 'price_higher' | 'price_lower' | 'out_of_stock' | 'product_removed' | 'wrong_unit' | 'duplicate_listing';

const REPORT_TYPES: { id: DiscrepancyType; label: string; icon: string; desc: string; color: string }[] = [
  { id: 'price_higher', label: 'Price is higher', icon: 'trending_up', desc: 'Shelf price is above catalog', color: 'text-red-500 border-red-400/30 bg-red-400/5' },
  { id: 'price_lower', label: 'Price is lower', icon: 'trending_down', desc: 'Shelf price is below catalog', color: 'text-green-500 border-green-400/30 bg-green-400/5' },
  { id: 'out_of_stock', label: 'Out of stock', icon: 'remove_shopping_cart', desc: 'Item is not available', color: 'text-amber-500 border-amber-400/30 bg-amber-400/5' },
  { id: 'product_removed', label: 'Product removed', icon: 'delete_sweep', desc: 'No longer sold here', color: 'text-orange-500 border-orange-400/30 bg-orange-400/5' },
  { id: 'wrong_unit', label: 'Wrong unit', icon: 'straighten', desc: 'Unit of measure is wrong', color: 'text-blue-500 border-blue-400/30 bg-blue-400/5' },
  { id: 'duplicate_listing', label: 'Duplicate listing', icon: 'content_copy', desc: 'This product appears twice', color: 'text-purple-500 border-purple-400/30 bg-purple-400/5' },
];

export function CatalogDiscrepancyDialog({ product, storeId, isOpen, onClose, onSubmitted }: CatalogDiscrepancyDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<DiscrepancyType | null>(null);
  const [observedPrice, setObservedPrice] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const needsPrice = selectedType === 'price_higher' || selectedType === 'price_lower';

  const reset = () => {
    setStep(1);
    setSelectedType(null);
    setObservedPrice('');
    setNote('');
    setSubmitted(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedType) return;
    // In production this would call discrepancyApi.submit(...)
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
      onSubmitted?.();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg bg-bg-surface border border-border-primary rounded-3xl shadow-glass overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-border-soft flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">
                  {step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
                </p>
                <h3 className="text-lg font-black text-text-main">
                  {step === 1 ? 'What did you notice?' : 'Add details'}
                </h3>
                <p className="text-xs text-text-muted mt-0.5 font-medium truncate max-w-[280px]">
                  Re: <span className="text-text-main font-bold">{product.productName}</span> — LBP {product.officialPriceLbp.toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 rounded-full bg-bg-muted flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg-muted/80 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Body */}
            {!submitted ? (
              <div className="p-6">
                {step === 1 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {REPORT_TYPES.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={cn(
                          'flex flex-col items-start gap-2 p-4 rounded-2xl border text-left transition-all',
                          selectedType === type.id ? type.color + ' ring-2 ring-current/30' : 'border-border-primary hover:border-primary/30 bg-bg-muted/30'
                        )}
                      >
                        <span className={cn('material-symbols-outlined text-[22px]', selectedType === type.id ? '' : 'text-text-muted')}>
                          {type.icon}
                        </span>
                        <div>
                          <p className="text-[11px] font-black text-text-main leading-none mb-0.5">{type.label}</p>
                          <p className="text-[9px] text-text-muted font-medium">{type.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {needsPrice && (
                      <div>
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-2">
                          Price you saw on shelf (LBP)
                        </label>
                        <div className="flex items-center gap-3 bg-bg-muted border border-border-primary rounded-xl px-4 py-3 focus-within:border-primary transition-all">
                          <span className="material-symbols-outlined text-[18px] text-text-muted">payments</span>
                          <input
                            type="number"
                            placeholder="e.g. 152000"
                            value={observedPrice}
                            onChange={e => setObservedPrice(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm font-bold text-text-main placeholder:text-text-muted/50"
                          />
                          <span className="text-[10px] font-black text-text-muted">LBP</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-2">
                        Additional note (optional)
                      </label>
                      <textarea
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="What did you see? Any details help admin verify..."
                        className="w-full h-24 bg-bg-muted border border-border-primary rounded-xl px-4 py-3 text-sm font-medium text-text-main placeholder:text-text-muted/50 outline-none focus:border-primary transition-all resize-none"
                      />
                    </div>
                    <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl">
                      <p className="text-[10px] text-primary font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">info</span>
                        Your report will be reviewed by an admin. If approved, the catalog updates immediately for all shoppers.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4"
                >
                  <span className="material-symbols-outlined text-green-500 text-[32px]">check_circle</span>
                </motion.div>
                <h4 className="text-lg font-black text-text-main">Report Submitted!</h4>
                <p className="text-xs text-text-muted mt-2 font-medium">Admin will review your report shortly.</p>
              </div>
            )}

            {/* Footer */}
            {!submitted && (
              <div className="px-6 pb-6 flex gap-3">
                {step === 2 && (
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 h-11 border border-border-primary rounded-xl text-sm font-bold text-text-muted hover:border-primary hover:text-primary transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={step === 1 ? () => setStep(2) : handleSubmit}
                  disabled={step === 1 && !selectedType}
                  className="flex-1 h-11 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all "
                >
                  {step === 1 ? 'Continue →' : 'Submit Report'}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
