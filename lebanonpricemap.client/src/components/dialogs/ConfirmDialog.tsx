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

const VARIANT_STYLES = {
  danger:  { btn: 'bg-red-600 border-red-600 text-white hover:bg-red-700', icon: 'warning', iconColor: 'text-red-500', iconBg: 'bg-red-50 border-red-100' },
  warning: { btn: 'bg-amber-500 border-amber-500 text-white hover:bg-amber-600', icon: 'error', iconColor: 'text-amber-500', iconBg: 'bg-amber-50 border-amber-100' },
  primary: { btn: 'bg-primary border-primary text-white hover:opacity-90', icon: 'help', iconColor: 'text-primary', iconBg: 'bg-primary/10 border-primary/20' },
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
  const user = useAuthStore(s => s.user);
  const submitRequest = useApprovalStore(s => s.submitRequest);
  const [loading, setLoading] = useState(false);

  const style = VARIANT_STYLES[variant];
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
      <div className="flex flex-col items-center text-center gap-5 py-2">

        {/* Icon */}
        <div className={cn('w-14 h-14 rounded-2xl border flex items-center justify-center', style.iconBg, style.iconColor)}>
          <span className="material-symbols-outlined text-[28px]">{style.icon}</span>
        </div>

        {/* Message */}
        <p className="text-sm text-text-sub font-medium leading-relaxed max-w-xs">{description}</p>

        {/* Actions */}
        <div className="flex flex-col gap-2 w-full mt-2">
          {rbacResult === 'allowed' ? (
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                'w-full h-12 rounded-xl font-bold text-sm border transition-all flex items-center justify-center gap-2',
                style.btn,
                loading && 'opacity-70 cursor-not-allowed'
              )}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">{style.icon}</span>
                  {confirmLabel}
                </>
              )}
            </button>
          ) : rbacResult === 'requires_approval' ? (
            <button
              onClick={handleRequestApproval}
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold text-sm border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-500 rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                  Request Approval
                </>
              )}
            </button>
          ) : null}

          <button
            onClick={close}
            className="w-full h-12 rounded-xl font-bold text-sm border border-border-soft text-text-muted hover:bg-bg-muted hover:text-text-main transition-all"
          >
            Cancel
          </button>
        </div>

        {rbacResult === 'requires_approval' && !loading && (
          <p className="text-xs text-text-muted">
            This action requires admin review before it can be executed.
          </p>
        )}
      </div>
    </RouteDialog>
  );
}