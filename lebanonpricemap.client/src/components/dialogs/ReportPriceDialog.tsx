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
  const [reportNote, setReportNote] = useState('');

  const handleSubmit = () => {
    onSubmit(selectedType, reportNote.trim());
    setReportNote('');
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
              <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-border-soft text-center">
                <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-red-600 text-[28px]">report_problem</span>
                </div>
                <h2 className="text-2xl font-black text-text-main">Report a problem</h2>
                <p className="text-sm text-text-muted mt-1">
                  Help us keep prices accurate for everyone.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                <div className="rounded-2xl bg-bg-muted border border-border-soft p-5 text-center mb-6">
                  <p className="text-xs font-bold text-text-muted mb-2">Current listed price</p>
                  <p className="text-3xl font-black text-text-main">
                    LBP {currentPrice.toLocaleString()}
                  </p>
                </div>

                <p className="text-xs font-bold text-text-muted mb-3">What is wrong?</p>
                <div className="grid grid-cols-1 gap-2 mb-6">
                  {reportOptions.map((option) => (
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
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    placeholder="Add any extra details that can help us review this report."
                    className="w-full h-28 p-4 rounded-2xl border border-border-soft bg-bg-base text-sm text-text-main placeholder:text-text-muted resize-none outline-none focus:border-red-500 transition-all"
                  />
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
                  className="w-full sm:flex-1 h-12 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}