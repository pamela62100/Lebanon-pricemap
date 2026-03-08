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
            className="fixed inset-0 bg-[#0A1128]/70 backdrop-blur-md z-40" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-bg-surface border border-text-main shadow-[12px_12px_0px_rgba(34,197,94,0.2)] max-w-sm w-full max-h-[90dvh] flex flex-col overflow-hidden pointer-events-auto">
              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-10">
                {/* Success icon - Structural Box */}
                <div className="w-20 h-20 mx-auto mb-8 bg-green-500/10 border border-green-500/30 flex items-center justify-center shadow-[4px_4px_0px_rgba(34,197,94,0.4)]">
                  <span className="material-symbols-outlined text-green-600" style={{ fontSize: '40px' }}>
                    verified
                  </span>
                </div>

                <h2 className="text-2xl font-serif font-black text-text-main mb-2 uppercase tracking-tight text-center">Transmission Success</h2>
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-[0.2em] mb-8 font-mono text-center">
                  ⊕ EARNED: +{trustPointsEarned} TRUST_UNITS
                </p>

                <div className="mb-2 text-center">
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.3em] mb-3">Captured Data Packet</p>
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-bg-base border border-border-soft">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>database</span>
                    <span className="text-sm font-black text-text-main uppercase tracking-tighter">{productName}</span>
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="p-10 pt-0 flex flex-col gap-2 shrink-0">
                <button
                  onClick={onViewUpload}
                  className="btn-consulate w-full h-14 bg-text-main text-bg-base border-text-main shadow-[3px_3px_0px_#0066FF]"
                >
                  VIEW_VERIFICATION_LOG
                </button>
                <button
                  onClick={onUploadAnother || onClose}
                  className="btn-consulate btn-outline w-full h-14"
                >
                  DEPART_TERMINAL
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
