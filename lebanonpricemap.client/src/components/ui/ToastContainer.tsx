import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/store/useToastStore';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const toasts = useToastStore(s => s.toasts);
  const removeToast = useToastStore(s => s.removeToast);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ y: 16, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0 }}
            onClick={() => removeToast(toast.id)}
            className={cn(
              'flex items-center gap-3 px-5 py-3 rounded-full text-sm font-semibold shadow-md cursor-pointer whitespace-nowrap',
              toast.type === 'success' && 'bg-green-600 text-white',
              toast.type === 'error' && 'bg-red-600 text-white',
              toast.type === 'warning' && 'bg-yellow-600 text-white',
              toast.type === 'info' && 'bg-text-main text-bg-base',
            )}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}