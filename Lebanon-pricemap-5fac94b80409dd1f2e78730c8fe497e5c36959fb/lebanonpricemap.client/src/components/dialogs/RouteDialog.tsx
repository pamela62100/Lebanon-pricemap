import { useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); onClose?.(); }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close, onClose]);

  // Portal renders directly into document.body — completely escapes
  // any parent stacking context, max-w container, or overflow clipping
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* True full-screen backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => { close(); onClose?.(); }}
          />

          {/* Dialog centered in viewport */}
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className={cn(
                'relative w-full rounded-[24px] bg-white border border-border-soft pointer-events-auto',
                'shadow-[0_24px_64px_rgba(0,0,0,0.18)] max-h-[90vh] flex flex-col',
                SIZE_MAP[size]
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-border-soft shrink-0">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-text-main tracking-tight">{title}</h2>
                  {description && (
                    <p className="text-sm text-text-muted mt-1.5 leading-relaxed">{description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => { close(); onClose?.(); }}
                  className="w-9 h-9 rounded-full border border-border-soft flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg-muted transition-all shrink-0 mt-0.5"
                  aria-label="Close dialog"
                >
                  <span className="material-symbols-outlined text-[17px]">close</span>
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}