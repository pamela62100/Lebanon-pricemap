import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FeedbackType } from '@/types';

interface ReportPriceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrice: number;
  onSubmit: (type: FeedbackType, note: string) => void;
}

const reportOptions: { value: FeedbackType; label: string; icon: string }[] = [
  { value: 'wrong_price',  label: 'Wrong price',  icon: '⚠️' },
  { value: 'wrong_store',  label: 'Wrong store',  icon: '📍' },
  { value: 'outdated',     label: 'Outdated',     icon: '🕐' },
  { value: 'fake_receipt', label: 'Fake receipt',  icon: '🚩' },
];

export function ReportPriceDialog({ isOpen, onClose, currentPrice, onSubmit }: ReportPriceDialogProps) {
  const [selectedType, setSelectedType] = useState<FeedbackType>('wrong_price');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    onSubmit(selectedType, note);
    setNote('');
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
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            // @ts-ignore
            className="fixed bottom-0 left-0 right-0 z-50 bg-bg-surface rounded-t-3xl p-6 pb-8 max-w-lg mx-auto"
          >
            <div className="w-10 h-1 bg-border-soft rounded-full mx-auto mb-6" />

            <div className="text-center mb-6">
              <span className="material-symbols-outlined text-primary text-3xl mb-2">report</span>
              <h2 className="text-xl font-bold text-text-main">Report Incorrect Price</h2>
              <p className="text-sm text-text-muted mt-1">Help us keep our community data accurate</p>
            </div>

            <div className="bg-bg-muted rounded-xl p-4 text-center mb-6">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Current Listed Price</p>
              <p className="text-2xl font-bold text-text-main">LBP {currentPrice.toLocaleString()}</p>
            </div>

            <p className="text-sm font-semibold text-text-sub mb-3">Select the reason for this report</p>
            <div className="flex flex-col gap-2 mb-4">
              {reportOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedType(opt.value)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    selectedType === opt.value
                      ? 'border-primary bg-primary-soft'
                      : 'border-border-soft bg-bg-surface hover:border-border-primary'
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span className="text-sm font-medium text-text-main">{opt.label}</span>
                  <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedType === opt.value ? 'border-primary' : 'border-border-soft'
                  }`}>
                    {selectedType === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                </button>
              ))}
            </div>

            <label className="block text-sm font-semibold text-text-sub mb-2">
              Additional details (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tell us more about what's wrong..."
              className="w-full h-20 p-3 rounded-xl border border-border-soft bg-bg-surface text-sm text-text-main placeholder:text-text-muted resize-none outline-none focus:border-primary focus:shadow-[0_0_0_3px_var(--primary-soft)] transition-all"
            />

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-colors"
              >
                Submit Report
              </button>
              <button onClick={onClose} className="text-sm font-medium text-text-muted hover:text-text-sub">
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
