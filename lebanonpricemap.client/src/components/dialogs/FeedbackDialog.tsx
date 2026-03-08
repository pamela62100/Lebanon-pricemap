import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

export function FeedbackDialog({ isOpen, onClose, onSubmit }: FeedbackDialogProps) {
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (note.trim()) {
      onSubmit(note.trim());
      setNote('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={onClose} />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-bg-surface rounded-t-3xl p-6 pb-8 max-w-lg mx-auto"
          >
            <div className="w-10 h-1 bg-border-soft rounded-full mx-auto mb-6" />
            <h2 className="text-xl font-bold text-text-main">Community Feedback</h2>
            <p className="text-sm text-text-muted mt-1 mb-6">Share your thoughts on this price entry</p>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add your comment..."
              rows={4}
              className="w-full p-4 rounded-xl border border-border-soft bg-bg-surface text-sm text-text-main placeholder:text-text-muted resize-none outline-none focus:border-primary focus:shadow-[0_0_0_3px_var(--primary-soft)] transition-all"
            />

            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="flex-1 h-12 rounded-xl border border-border-soft text-text-sub font-semibold hover:bg-bg-muted transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={!note.trim()} className="flex-1 h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Submit
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
