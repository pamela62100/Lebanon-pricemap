import { useEffect, useRef } from 'react';
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
  md: 'max-w-lg',
  lg: 'max-w-2xl',
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
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, close, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              close();
              onClose?.();
            }}
          />

          <motion.div
            ref={panelRef}
            className={cn(
              'relative w-full rounded-2xl sm:rounded-3xl bg-white border border-border-primary shadow-glass overflow-hidden max-h-[92dvh]',
              SIZE_MAP[size]
            )}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-border-primary bg-bg-base/40">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-black text-text-main leading-tight">
                  {title}
                </h2>
                {description && (
                  <p className="mt-1 text-sm text-text-muted leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  close();
                  onClose?.();
                }}
                className="w-10 h-10 rounded-full border border-border-soft flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg-muted transition-all shrink-0"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="px-5 sm:px-6 py-5 sm:py-6 overflow-y-auto max-h-[calc(92dvh-88px)]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}