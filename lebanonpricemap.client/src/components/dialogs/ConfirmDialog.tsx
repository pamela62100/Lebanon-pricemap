import { useState } from 'react';
import { motion } from 'framer-motion';
import { RouteDialog } from '@/components/dialogs/RouteDialog';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { useAuthStore } from '@/store/useAuthStore';
import { useApprovalStore } from '@/store/useApprovalStore';
import { can } from '@/lib/permissions';
import type { Permission } from '@/lib/permissions';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  /** Must match the ?dialog=<dialogId> URL param */
  dialogId: string;
  /** Dialog title */
  title: string;
  /** Description / warning shown to user */
  description: string;
  /** Text on the confirm button */
  confirmLabel?: string;
  /** Color variant */
  variant?: 'danger' | 'warning' | 'primary';
  /** Callback when confirmed */
  onConfirm: () => void;
  /** Optional: if set, the confirm button is guarded by RBAC */
  permission?: Permission;
  /** If RBAC-guarded, the label for the approval request */
  approvalLabel?: string;
  /** If RBAC-guarded, payload for the approval request */
  approvalPayload?: Record<string, unknown>;
}

const VARIANT_STYLES = {
  danger:  { btn: 'bg-red-600 border-red-600 text-white hover:bg-red-700', icon: 'warning', iconColor: 'text-red-600' },
  warning: { btn: 'bg-amber-500 border-amber-500 text-white hover:bg-amber-600', icon: 'error', iconColor: 'text-amber-500' },
  primary: { btn: 'bg-text-main border-text-main text-bg-base hover:bg-primary hover:border-primary', icon: 'help', iconColor: 'text-primary' },
};

/**
 * ConfirmDialog — a URL-controlled destructive action confirmation modal.
 */
export function ConfirmDialog({
  dialogId,
  title,
  description,
  confirmLabel = 'Confirm',
  variant = 'primary',
  onConfirm,
  permission,
  approvalLabel,
  approvalPayload = {},
}: ConfirmDialogProps) {
  const { close } = useRouteDialog();
  const user = useAuthStore(s => s.user);
  const submitRequest = useApprovalStore(s => s.submitRequest);
  const [loading, setLoading] = useState(false);

  const style = VARIANT_STYLES[variant];

  // Check RBAC if permission is set
  const rbacResult = permission ? can(user?.role, permission) : 'allowed';

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      onConfirm();
      setLoading(false);
      close();
    }, 300);
  };

  const handleRequestApproval = () => {
    submitRequest(permission!, {
      label: approvalLabel ?? title,
      requestedBy: user?.id,
      ...approvalPayload,
    });
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      close();
    }, 400);
  };

  return (
    <RouteDialog dialogId={dialogId} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-6 py-2">
        {/* Icon - Structural Box */}
        <div className={cn('w-16 h-16 bg-bg-muted border border-border-soft flex items-center justify-center', style.iconColor)}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>{style.icon}</span>
        </div>

        {/* Message - Precision Text */}
        <p className="text-sm text-text-sub font-medium leading-relaxed max-w-xs">{description}</p>

        {/* Actions - Technical Buttons */}
        <div className="flex flex-col gap-2 w-full mt-4">
          {rbacResult === 'allowed' ? (
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                'btn-consulate w-full h-14',
                style.btn,
                loading && 'opacity-70 cursor-not-allowed'
              )}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">{style.icon}</span>
                  {confirmLabel.toUpperCase()}
                </span>
              )}
            </button>
          ) : rbacResult === 'requires_approval' ? (
            <button
              onClick={handleRequestApproval}
              disabled={loading}
              className="btn-consulate w-full h-14 bg-amber-500/10 border-amber-500/30 text-amber-700 hover:bg-amber-500 hover:text-white"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-500 rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                  REQUEST_APPROVAL
                </span>
              )}
            </button>
          ) : null}

          <button
            onClick={close}
            className="btn-consulate btn-outline w-full h-14"
          >
            TERMINATE_DIALOG
          </button>
        </div>

        {/* RBAC hint */}
        {rbacResult === 'requires_approval' && !loading && (
          <p className="text-[10px] text-text-muted">
            This action requires admin review before it can be executed.
          </p>
        )}
      </div>
    </RouteDialog>
  );
}
