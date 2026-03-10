import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

export function FeedbackDialog({ isOpen, onClose, onSubmit }: FeedbackDialogProps) {
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = () => {
    const trimmedMessage = feedbackMessage.trim();
    if (!trimmedMessage) return;

    onSubmit(trimmedMessage);
    setFeedbackMessage('');
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
            <div className="w-full max-w-lg rounded-3xl bg-bg-surface border border-border-primary shadow-glass overflow-hidden">
              <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-border-soft">
                <p className="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-2">
                  WenArkhass Feedback
                </p>
                <h2 className="text-2xl font-black text-text-main">Share your feedback</h2>
                <p className="text-sm text-text-muted mt-1">
                  Tell us what is working, what feels confusing, or what we should improve.
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Write your feedback here..."
                  rows={5}
                  className="w-full rounded-2xl border border-border-soft bg-bg-base px-4 py-3 text-sm text-text-main placeholder:text-text-muted resize-none outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:flex-1 h-12 rounded-2xl border border-border-soft text-text-muted hover:bg-bg-muted hover:text-text-main transition-all font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!feedbackMessage.trim()}
                  className="w-full sm:flex-1 h-12 rounded-2xl bg-primary text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                >
                  Send Feedback
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}