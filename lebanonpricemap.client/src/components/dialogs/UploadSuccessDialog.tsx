import { motion, AnimatePresence } from 'framer-motion';

interface UploadSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  trustPointsEarned?: number;
  onViewUpload?: () => void;
  onUploadAnother?: () => void;
}

export function UploadSuccessDialog({
  isOpen, onClose, productName = 'Product', trustPointsEarned = 1,
  onViewUpload, onUploadAnother,
}: UploadSuccessDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-bg-surface rounded-3xl p-8 max-w-sm w-full text-center shadow-xl">
              {/* Success icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--status-verified-bg)] flex items-center justify-center">
                <span className="material-symbols-outlined text-[var(--status-verified-text)]" style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>

              <h2 className="text-2xl font-bold text-text-main mb-2">Receipt Uploaded!</h2>
              <p className="text-sm text-[var(--status-verified-text)] font-semibold mb-6">
                ⊕ You earned +{trustPointsEarned} Trust Point{trustPointsEarned > 1 ? 's' : ''}
              </p>

              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Captured Item</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-bg-muted rounded-full mb-8">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>shopping_bag</span>
                <span className="text-sm font-semibold text-text-main">{productName}</span>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={onViewUpload}
                  className="w-full h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors"
                >
                  View My Upload
                </button>
                <button
                  onClick={onUploadAnother || onClose}
                  className="text-sm font-medium text-text-muted hover:text-text-sub"
                >
                  Upload Another
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
