import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { cn } from '@/lib/utils';

interface RouteDialogProps {
  dialogId: string;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClose?: () => void;
}

const SIZE_MAP = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
};

export function RouteDialog({
  dialogId,
  title,
  description,
  size = 'md',
  children,
  onClose,
}: RouteDialogProps) {
  const { isOpen, close } = useRouteDialog();
  const open = isOpen(dialogId);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        onClose?.();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, close, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={() => {
              close();
              onClose?.();
            }}
          />

          <div className="absolute inset-0 overflow-y-auto">
            <div className="min-h-full px-4 py-24 sm:px-6 sm:py-28 flex items-start justify-center">
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  'relative w-full rounded-[28px] bg-white border border-border-soft shadow-[0_24px_80px_rgba(15,23,42,0.16)] overflow-hidden',
                  SIZE_MAP[size]
                )}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 px-6 sm:px-8 pt-6 sm:pt-7 pb-5 border-b border-border-soft bg-white">
                  <div className="min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight">
                      {title}
                    </h2>
                    {description ? (
                      <p className="text-sm sm:text-base text-text-muted mt-2 leading-relaxed max-w-2xl">
                        {description}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      close();
                      onClose?.();
                    }}
                    className="w-11 h-11 rounded-full border border-border-soft flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg-muted transition-all shrink-0"
                    aria-label="Close dialog"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <div className="px-6 sm:px-8 py-6 sm:py-8 max-h-[calc(100vh-220px)] overflow-y-auto">
                  {children}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}