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

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        onClose?.();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
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
          <button
            type="button"
            aria-label="Close dialog"
            onClick={() => {
              close();
              onClose?.();
            }}
            className="absolute inset-0 bg-white/55"
          />

          <div className="absolute inset-0 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center px-4 py-6 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.985 }}
                transition={{ duration: 0.18 }}
                className={cn(
                  'relative w-full rounded-[24px] bg-white border border-border-soft shadow-[0_20px_60px_rgba(15,23,42,0.10)] overflow-hidden',
                  SIZE_MAP[size]
                )}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-5 pb-4 border-b border-border-soft">
                  <div className="min-w-0">
                    <h2 className="text-2xl sm:text-[30px] font-bold text-text-main tracking-tight">
                      {title}
                    </h2>
                    {description ? (
                      <p className="text-sm sm:text-base text-text-muted mt-2 leading-relaxed">
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
                    className="w-10 h-10 rounded-full border border-border-soft flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg-muted transition-all shrink-0"
                    aria-label="Close dialog"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div className="px-5 sm:px-6 py-5">
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