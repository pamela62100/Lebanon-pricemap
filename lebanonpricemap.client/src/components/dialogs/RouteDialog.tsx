import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { cn } from '@/lib/utils';

interface RouteDialogProps {
  /** Must match the `?dialog=<dialogId>` URL param */
  dialogId: string;
  /** Dialog title */
  title: string;
  /** Optional subtitle */
  description?: string;
  /** Dialog width */
  size?: 'sm' | 'md' | 'lg';
  /** Content */
  children: React.ReactNode;
  /** Called after the dialog is closed (optional) */
  onClose?: () => void;
}

const SIZE_MAP = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

/**
 * RouteDialog — a URL-controlled animated modal.
 *
 * - Opens when `?dialog=<dialogId>` matches
 * - Closes on backdrop click, Escape key, or calling close()
 * - GPU-friendly animations (opacity + transform only)
 */
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

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        onClose?.();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, close, onClose]);

  // Trap focus inside the dialog
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop - Soft Fog */}
          <motion.div
            className="absolute inset-0 bg-white/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { close(); onClose?.(); }}
          />

          {/* Panel - Editorial Card */}
          <motion.div
            ref={panelRef}
            className={cn(
              'relative w-full bg-white border border-border-primary shadow-glass overflow-hidden rounded-xl',
              SIZE_MAP[size]
            )}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header - Technical Band */}
            <div className="flex items-start justify-between px-8 pt-10 pb-6 border-b border-border-primary bg-bg-base/30">
              <div>
                <h2 className="font-display text-2xl text-text-main leading-tight tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>{title}</h2>
                {description && <p className="text-[10px] font-data font-black text-primary uppercase tracking-[0.2em] mt-2">{description}</p>}
              </div>
              <button
                onClick={() => { close(); onClose?.(); }}
                className="w-10 h-10 border border-border-soft flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg-muted transition-all shrink-0"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
              </button>
            </div>

            {/* Content - Precision Spacing */}
            <div className="px-8 py-8">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
