import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

export function FeedbackDialog({ isOpen, onClose, onSubmit }: FeedbackDialogProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    onSubmit(trimmed);
    setMessage('');
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
            <div className="w-full max-w-lg rounded-[28px] bg-bg-surface border border-border-primary shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden">
              <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-border-soft">
                <p className="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-2">
                  Feedback
                </p>
                <h2 className="text-2xl font-black text-text-main">Share your feedback</h2>
                <p className="text-sm text-text-muted mt-1">
                  Tell us what is working, what feels confusing, or what we should improve.
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your feedback here..."
                  rows={5}
                  className="w-full rounded-3xl border border-border-soft bg-bg-base px-4 py-4 text-sm text-text-main placeholder:text-text-muted resize-none outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:flex-1 h-12 rounded-full border border-border-soft text-text-muted hover:bg-bg-muted hover:text-text-main transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim()}
                  className="w-full sm:flex-1 h-12 rounded-full bg-primary text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 transition-all"
                >
                  Send Feedback
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