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
            className="fixed inset-0 bg-[#0A1128]/70 backdrop-blur-md z-40" onClick={onClose} />
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            className="fixed inset-0 m-auto z-50 bg-bg-surface border border-text-main shadow-[12px_12px_0px_rgba(0,102,255,0.3)] max-w-lg w-full max-h-[90dvh] flex flex-col overflow-hidden"
          >
            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 pt-10">
              <div className="mb-8 border-b border-border-soft pb-6">
                <span className="text-primary font-bold text-[10px] tracking-[0.4em] uppercase mb-4 block">COMMUNITY_PULSE // FEEDBACK_LOG</span>
                <h2 className="text-2xl font-serif font-black text-text-main uppercase tracking-tight">System Feedback</h2>
                <p className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-widest">Share logistical structural updates</p>
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="INITIALIZING_INPUT_BUFFER..."
                rows={4}
                className="w-full p-4 border border-border-soft bg-bg-base text-sm text-text-main placeholder:text-text-muted resize-none outline-none focus:border-primary transition-all font-mono"
              />
            </div>

            {/* Fixed Footer */}
            <div className="p-8 pt-0 flex flex-col gap-2 shrink-0">
              <button 
                onClick={handleSubmit} 
                disabled={!note.trim()} 
                className="btn-consulate w-full h-14 bg-text-main text-bg-base border-text-main shadow-[3px_3px_0px_#0066FF] disabled:opacity-30 disabled:shadow-none"
              >
                SUBMIT_LOG
              </button>
              <button 
                onClick={onClose} 
                className="btn-consulate btn-outline w-full h-14"
              >
                ABORT_ACTION
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
