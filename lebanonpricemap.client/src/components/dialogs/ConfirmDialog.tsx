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

const VARIANT = {
  danger: {
    icon: 'warning',
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
    button: 'bg-red-600 hover:bg-red-700 text-white',
  },
  warning: {
    icon: 'error',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
    button: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  primary: {
    icon: 'help',
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
    button: 'bg-primary hover:opacity-90 text-white',
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
  const user = useAuthStore((s) => s.user);
  const submitRequest = useApprovalStore((s) => s.submitRequest);
  const [loading, setLoading] = useState(false);

  const style = VARIANT[variant];
  const rbac = permission ? can(user?.role, permission) : 'allowed';

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      onConfirm();
      close();
      setLoading(false);
    }, 250);
  };

  const handleApproval = () => {
    submitRequest(permission!, {
      label: approvalLabel ?? title,
      requestedBy: user?.id,
      ...approvalPayload,
    });

    setLoading(true);
    setTimeout(() => {
      close();
      setLoading(false);
    }, 350);
  };

  return (
    <RouteDialog dialogId={dialogId} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-6 py-4">

        {/* Icon */}
        <div
          className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center',
            style.iconBg
          )}
        >
          <span
            className={cn(
              'material-symbols-outlined text-[30px]',
              style.iconColor
            )}
          >
            {style.icon}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-text-muted max-w-xs leading-relaxed">
          {description}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full mt-2">

          {rbac === 'allowed' ? (
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                'w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all',
                style.button,
                loading && 'opacity-70 cursor-not-allowed'
              )}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    {style.icon}
                  </span>
                  {confirmLabel}
                </>
              )}
            </button>
          ) : rbac === 'requires_approval' ? (
            <button
              onClick={handleApproval}
              disabled={loading}
              className="w-full h-12 rounded-xl font-semibold border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-500 rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    admin_panel_settings
                  </span>
                  Request Approval
                </>
              )}
            </button>
          ) : null}

          <button
            onClick={close}
            className="w-full h-12 rounded-xl font-semibold border border-border-soft text-text-muted hover:bg-bg-muted hover:text-text-main transition"
          >
            Cancel
          </button>
        </div>

        {rbac === 'requires_approval' && !loading && (
          <p className="text-xs text-text-muted">
            This action requires admin approval.
          </p>
        )}
      </div>
    </RouteDialog>
  );
}