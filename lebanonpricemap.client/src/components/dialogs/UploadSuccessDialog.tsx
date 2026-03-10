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
  isOpen,
  onClose,
  productName = 'Product',
  trustPointsEarned = 1,
  onViewUpload,
  onUploadAnother,
}: UploadSuccessDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/22 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.985, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.985, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4"
          >
            <div className="w-full max-w-sm rounded-[28px] bg-bg-surface border border-border-primary shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden">
              <div className="p-6 sm:p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600 text-[40px]">
                    verified
                  </span>
                </div>

                <h2 className="text-2xl font-black text-text-main mb-2">
                  Upload successful
                </h2>

                <p className="text-sm text-green-600 font-bold mb-6">
                  You earned +{trustPointsEarned} trust point{trustPointsEarned > 1 ? 's' : ''}.
                </p>

                <div className="rounded-2xl bg-bg-base border border-border-soft px-4 py-3 inline-flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    inventory_2
                  </span>
                  <span className="text-sm font-bold text-text-main">{productName}</span>
                </div>
              </div>

              <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex flex-col gap-3">
                <button
                  onClick={onViewUpload}
                  className="w-full h-12 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition-all"
                >
                  View Upload
                </button>
                <button
                  onClick={onUploadAnother || onClose}
                  className="w-full h-12 rounded-full border border-border-soft text-text-main font-semibold hover:bg-bg-muted transition-all"
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