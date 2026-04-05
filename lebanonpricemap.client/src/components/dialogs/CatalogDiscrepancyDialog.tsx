import { useState } from 'react';
import { createPortal } from 'react-dom';
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

type DiscrepancyType =
  | 'price_higher'
  | 'price_lower'
  | 'out_of_stock'
  | 'product_removed'
  | 'wrong_unit'
  | 'duplicate_listing';

const REPORT_TYPES: {
  id: DiscrepancyType;
  label: string;
  icon: string;
  desc: string;
  color: string;
}[] = [
  {
    id: 'price_higher',
    label: 'Price is higher',
    icon: 'trending_up',
    desc: 'Shelf price is above the catalog',
    color: 'text-red-600 border-red-300 bg-red-50',
  },
  {
    id: 'price_lower',
    label: 'Price is lower',
    icon: 'trending_down',
    desc: 'Shelf price is below the catalog',
    color: 'text-green-600 border-green-300 bg-green-50',
  },
  {
    id: 'out_of_stock',
    label: 'Out of stock',
    icon: 'remove_shopping_cart',
    desc: 'Item is not available in store',
    color: 'text-amber-600 border-amber-300 bg-amber-50',
  },
  {
    id: 'product_removed',
    label: 'Product removed',
    icon: 'delete_sweep',
    desc: 'No longer sold at this store',
    color: 'text-orange-600 border-orange-300 bg-orange-50',
  },
  {
    id: 'wrong_unit',
    label: 'Wrong unit',
    icon: 'straighten',
    desc: 'Unit of measure is incorrect',
    color: 'text-blue-600 border-blue-300 bg-blue-50',
  },
  {
    id: 'duplicate_listing',
    label: 'Duplicate listing',
    icon: 'content_copy',
    desc: 'This product appears twice',
    color: 'text-purple-600 border-purple-300 bg-purple-50',
  },
];

export function CatalogDiscrepancyDialog({
  product,
  storeId,
  isOpen,
  onClose,
  onSubmitted,
}: CatalogDiscrepancyDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<DiscrepancyType | null>(null);
  const [observedPrice, setObservedPrice] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const needsPrice =
    selectedType === 'price_higher' || selectedType === 'price_lower';

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
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
      onSubmitted?.();
    }, 2000);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-bg-surface border border-border-primary rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-border-soft flex items-start justify-between gap-3">
              <div>
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2].map((s) => (
                    <div
                      key={s}
                      className={cn(
                        'h-1 rounded-full transition-all duration-300',
                        s === step ? 'w-6 bg-primary' : s < step ? 'w-4 bg-primary/40' : 'w-4 bg-border-soft'
                      )}
                    />
                  ))}
                  <span className="text-[10px] font-semibold text-text-muted ml-1">
                    Step {step} of 2
                  </span>
                </div>

                <h3 className="text-base font-bold text-text-main leading-tight">
                  {step === 1 ? 'What did you notice?' : 'Add details'}
                </h3>
                <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                  Reporting:{' '}
                  <span className="text-text-main font-semibold">
                    {product.productName}
                  </span>{' '}
                  — {product.officialPriceLbp.toLocaleString()} LBP
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-bg-muted flex items-center justify-center text-text-muted hover:text-text-main transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Body */}
            {!submitted ? (
              <div className="p-5">
                {step === 1 ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    {REPORT_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={cn(
                          'flex flex-col items-start gap-2 p-3.5 rounded-xl border text-left transition-all',
                          selectedType === type.id
                            ? type.color
                            : 'border-border-primary bg-bg-muted/20 hover:bg-bg-muted/50'
                        )}
                      >
                        <span
                          className={cn(
                            'material-symbols-outlined text-[20px]',
                            selectedType === type.id ? '' : 'text-text-muted'
                          )}
                        >
                          {type.icon}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-text-main leading-tight mb-0.5">
                            {type.label}
                          </p>
                          <p className="text-[10px] text-text-muted leading-snug">
                            {type.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {needsPrice && (
                      <div>
                        <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wide block mb-1.5">
                          Price you saw on shelf (LBP)
                        </label>
                        <div className="flex items-center gap-3 bg-bg-muted border border-border-primary rounded-xl px-4 py-3 focus-within:border-text-main/40 transition-all">
                          <span className="material-symbols-outlined text-[16px] text-text-muted">
                            payments
                          </span>
                          <input
                            type="number"
                            placeholder="e.g. 152,000"
                            value={observedPrice}
                            onChange={(e) => setObservedPrice(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm font-semibold text-text-main placeholder:text-text-muted/40"
                          />
                          <span className="text-[11px] font-semibold text-text-muted">
                            LBP
                          </span>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wide block mb-1.5">
                        Additional note{' '}
                        <span className="normal-case font-normal">(optional)</span>
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Any extra details that might help our team verify this..."
                        className="w-full h-24 bg-bg-muted border border-border-primary rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-text-muted/40 outline-none focus:border-text-main/40 transition-all resize-none"
                      />
                    </div>
                    <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
                      <span className="material-symbols-outlined text-[14px] text-blue-500 mt-0.5 shrink-0">
                        info
                      </span>
                      <p className="text-[11px] text-blue-700 font-medium leading-snug">
                        Your report will be reviewed by our team. If approved, the
                        catalog updates immediately for all shoppers.
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
                  transition={{ type: 'spring', damping: 14 }}
                  className="w-14 h-14 rounded-full bg-green-100 border border-green-300 flex items-center justify-center mx-auto mb-4"
                >
                  <span className="material-symbols-outlined text-green-600 text-[28px]">
                    check_circle
                  </span>
                </motion.div>
                <h4 className="text-base font-bold text-text-main">
                  Report submitted!
                </h4>
                <p className="text-sm text-text-muted mt-1">
                  Our team will review this shortly.
                </p>
              </div>
            )}

            {/* Footer */}
            {!submitted && (
              <div className="px-5 pb-5 flex gap-2.5">
                {step === 2 && (
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 h-10 border border-border-primary rounded-xl text-sm font-semibold text-text-muted hover:border-text-main/30 hover:text-text-main transition-all"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={step === 1 ? () => setStep(2) : handleSubmit}
                  disabled={step === 1 && !selectedType}
                  className="flex-1 h-10 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                >
                  {step === 1 ? 'Continue' : 'Submit report'}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}