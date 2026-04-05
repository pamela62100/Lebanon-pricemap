import { useState } from 'react';
import { RouteDialog } from '@/components/dialogs/RouteDialog';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { useAuthStore } from '@/store/useAuthStore';
import { useApprovalStore } from '@/store/useApprovalStore';
import { can } from '@/lib/permissions';
import type { Permission } from '@/lib/permissions';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  dialogId: string;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  permission?: Permission;
  approvalLabel?: string;
  approvalPayload?: Record<string, unknown>;
}

const VARIANT_STYLES = {
  danger: {
    icon: 'delete',
    iconWrap: 'bg-red-50 text-red-500',
    button: 'bg-primary hover:opacity-95 text-white',
  },
  warning: {
    icon: 'warning',
    iconWrap: 'bg-amber-50 text-amber-500',
    button: 'bg-primary hover:opacity-95 text-white',
  },
  primary: {
    icon: 'help',
    iconWrap: 'bg-bg-muted text-text-main',
    button: 'bg-primary hover:opacity-95 text-white',
  },
};

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
  const user = useAuthStore((state) => state.user);
  const submitRequest = useApprovalStore((state) => state.submitRequest);
  const [loading, setLoading] = useState(false);

  const style = VARIANT_STYLES[variant];
  const permissionResult = permission ? can(user?.role, permission) : 'allowed';

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      onConfirm();
      setLoading(false);
      close();
    }, 220);
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
    }, 320);
  };

  return (
    <RouteDialog dialogId={dialogId} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-6 py-2">
        <div
          className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center',
            style.iconWrap
          )}
        >
          <span className="material-symbols-outlined text-[30px]">{style.icon}</span>
        </div>

        <p className="text-base text-text-muted leading-relaxed max-w-sm">{description}</p>

        <div className="flex flex-col gap-3 w-full mt-1">
          {permissionResult === 'allowed' ? (
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                'w-full h-14 rounded-full font-semibold text-lg transition-all flex items-center justify-center',
                style.button,
                loading && 'opacity-70 cursor-not-allowed'
              )}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                confirmLabel
              )}
            </button>
          ) : permissionResult === 'requires_approval' ? (
            <button
              onClick={handleRequestApproval}
              disabled={loading}
              className="w-full h-14 rounded-full font-semibold text-lg border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-500 rounded-full animate-spin" />
              ) : (
                'Request approval'
              )}
            </button>
          ) : null}

          <button
            onClick={close}
            className="w-full h-14 rounded-full border border-border-soft text-text-muted hover:bg-bg-muted hover:text-text-main transition-all font-semibold text-lg"
          >
            Cancel
          </button>
        </div>

        {permissionResult === 'requires_approval' && !loading ? (
          <p className="text-sm text-text-muted">
            This action needs approval before it can be completed.
          </p>
        ) : null}
      </div>
    </RouteDialog>
  );
}