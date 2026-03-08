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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A1128]/70 backdrop-blur-md z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            className="fixed inset-0 m-auto z-50 bg-bg-surface border border-text-main shadow-[12px_12px_0px_rgba(239,68,68,0.2)] max-w-lg w-full max-h-[90dvh] flex flex-col overflow-hidden"
          >
            {/* Fixed Header */}
            <div className="p-8 pb-6 border-b border-border-soft shrink-0 text-center">
              <div className="w-12 h-12 bg-red-600/10 border border-red-600/20 flex items-center justify-center mx-auto mb-4">
                 <span className="material-symbols-outlined text-red-600 text-3xl">report_problem</span>
              </div>
              <h2 className="text-2xl font-serif font-black text-text-main uppercase tracking-tight">Report Anomaly</h2>
              <p className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-widest font-mono">INTEGRITY_AUDIT // SEQ_0842</p>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="bg-bg-muted border border-border-soft p-6 text-center mb-8">
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Listed Value Assessment</p>
                <p className="text-3xl font-serif font-black text-text-main">LBP {currentPrice.toLocaleString()}</p>
              </div>

              <p className="text-[10px] font-bold text-text-muted mb-4 uppercase tracking-widest">Select Discrepancy Vector</p>
              <div className="grid grid-cols-1 gap-2 mb-8">
                {reportOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedType(opt.value)}
                    className={`flex items-center gap-4 p-4 border text-left transition-all ${
                      selectedType === opt.value
                        ? 'border-red-600 bg-red-600/5 text-red-700 shadow-[2px_2px_0px_rgba(220,38,38,0.3)]'
                        : 'border-border-soft bg-bg-surface hover:border-red-600/30'
                    }`}
                  >
                    <span className="text-lg grayscale">{opt.icon}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest">{opt.label}</span>
                    <div className={`ml-auto w-4 h-4 border flex items-center justify-center transition-all ${
                      selectedType === opt.value ? 'border-red-600 bg-red-600' : 'border-border-soft'
                    }`}>
                      {selectedType === opt.value && <span className="w-1.5 h-1.5 bg-white" />}
                    </div>
                  </button>
                ))}
              </div>

              <div>
                 <label className="block text-[10px] font-bold text-text-muted mb-3 uppercase tracking-widest">Technical Justification (Optional)</label>
                 <textarea
                   value={note}
                   onChange={(e) => setNote(e.target.value)}
                   placeholder="INITIALIZING_LOG_ENTRY..."
                   className="w-full h-24 p-4 border border-border-soft bg-bg-base text-sm text-text-main placeholder:text-text-muted resize-none outline-none focus:border-red-600 transition-all font-mono"
                 />
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-8 pt-6 border-t border-border-soft flex flex-col gap-2 shrink-0">
              <button
                onClick={handleSubmit}
                className="btn-consulate w-full h-14 bg-red-600 text-white border-red-600 shadow-[3px_3px_0px_rgba(0,0,0,0.2)]"
              >
                SUBMIT_REPORT
              </button>
              <button onClick={onClose} className="btn-consulate btn-outline w-full h-14">
                TERMINATE_ACTION
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
