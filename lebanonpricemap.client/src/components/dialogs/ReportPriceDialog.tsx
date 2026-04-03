import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { FeedbackType } from '@/types';

interface ReportPriceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrice: number;
  onSubmit: (type: FeedbackType, note: string) => void;
}

const REPORT_OPTIONS: { value: FeedbackType; label: string; icon: string }[] = [
  { value: 'wrong_price', label: 'Wrong price', icon: 'sell' },
  { value: 'wrong_store', label: 'Wrong store', icon: 'storefront' },
  { value: 'outdated', label: 'Outdated information', icon: 'schedule' },
  { value: 'fake_receipt', label: 'Suspicious proof or receipt', icon: 'flag' },
];

export function ReportPriceDialog({
  isOpen,
  onClose,
  currentPrice,
  onSubmit,
}: ReportPriceDialogProps) {
  const [selectedType, setSelectedType] = useState<FeedbackType>('wrong_price');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    onSubmit(selectedType, note.trim());
    setNote('');
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4"
          >
            <div className="w-full max-w-lg rounded-[28px] bg-bg-surface border border-border-primary shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden max-h-[92dvh] flex flex-col">
              <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-border-soft text-center">
                <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-red-600 text-[28px]">
                    report_problem
                  </span>
                </div>
                <h2 className="text-2xl font-black text-text-main">Report a problem</h2>
                <p className="text-sm text-text-muted mt-1">
                  Help us keep prices accurate for everyone.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                <div className="rounded-3xl bg-bg-muted border border-border-soft p-5 text-center mb-6">
                  <p className="text-xs font-bold text-text-muted mb-2">Current listed price</p>
                  <p className="text-3xl font-black text-text-main">
                    LBP {currentPrice.toLocaleString()}
                  </p>
                </div>

                <p className="text-xs font-bold text-text-muted mb-3">What is wrong?</p>
                <div className="grid grid-cols-1 gap-2 mb-6">
                  {REPORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedType(option.value)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                        selectedType === option.value
                          ? 'border-red-600 bg-red-600/5 text-red-700'
                          : 'border-border-soft bg-bg-surface hover:border-red-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{option.icon}</span>
                      <span className="text-sm font-bold">{option.label}</span>
                      <div className="ml-auto">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            selectedType === option.value
                              ? 'border-red-600 bg-red-600'
                              : 'border-border-soft'
                          }`}
                        />
                      </div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-2">
                    Additional details (optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add any extra details that can help us review this report."
                    className="w-full h-28 p-4 rounded-3xl border border-border-soft bg-bg-base text-sm text-text-main placeholder:text-text-muted resize-none outline-none focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:flex-1 h-12 rounded-full border border-border-soft text-text-muted hover:bg-bg-muted hover:text-text-main transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="w-full sm:flex-1 h-12 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}