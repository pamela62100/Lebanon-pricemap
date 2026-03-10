import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { useToastStore } from '@/store/useToastStore';
import { MOCK_STORES } from '@/api/mockData';
import { cn } from '@/lib/utils';

export function ReportRealityDialog() {
  const { isOpen, getParam, close } = useRouteDialog();
  const addToast = useToastStore((state) => state.addToast);

  const dialogId = 'report-reality';
  const isVisible = isOpen(dialogId);
  const storeId = getParam('storeId');
  const reportType = getParam('type') as 'market' | 'fuel';

  const [isFuelRationed, setIsFuelRationed] = useState(false);
  const [queueCount, setQueueCount] = useState('');

  const store = MOCK_STORES.find((s) => s.id === storeId);

  const handleSubmit = () => {
    addToast('Thanks for the update.');
    close();
    setIsFuelRationed(false);
    setQueueCount('');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => close()}
          />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)] border border-black/5 overflow-hidden"
          >
            <div className="px-8 pt-8 pb-5 border-b border-border-soft flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-text-main leading-tight">
                  Report fuel station status
                </h2>
                <p className="text-base text-text-muted mt-2">
                  Share what is happening now at {store?.name ?? 'this station'}.
                </p>
              </div>

              <button
                onClick={() => close()}
                className="w-12 h-12 rounded-full border border-border-soft text-text-muted hover:text-text-main hover:bg-bg-muted transition-all shrink-0 flex items-center justify-center"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <div className="px-8 py-8 space-y-6">
              {reportType === 'fuel' && (
                <>
                  <div className="rounded-3xl border border-border-soft bg-bg-surface px-5 py-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xl font-bold text-text-main">Fuel rationing</p>
                      <p className="text-sm text-text-muted mt-1">
                        Turn this on if there is a spending or volume limit.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsFuelRationed((value) => !value)}
                      className={cn(
                        'relative w-16 h-9 rounded-full transition-all shrink-0',
                        isFuelRationed ? 'bg-text-main' : 'bg-bg-muted border border-border-soft'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-1 w-7 h-7 rounded-full bg-white shadow-sm transition-all',
                          isFuelRationed ? 'right-1' : 'left-1'
                        )}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text-muted mb-3">
                      Approximate queue size
                    </label>
                    <input
                      value={queueCount}
                      onChange={(e) => setQueueCount(e.target.value)}
                      placeholder="e.g. 15"
                      className="w-full h-14 rounded-3xl border border-border-soft bg-bg-surface px-5 text-xl text-text-main placeholder:text-text-muted outline-none focus:border-text-main transition-all"
                    />
                  </div>
                </>
              )}

              <button
                onClick={handleSubmit}
                className="w-full h-14 rounded-3xl bg-text-main text-white text-xl font-semibold hover:opacity-95 transition-all"
                type="button"
              >
                Submit Update
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}