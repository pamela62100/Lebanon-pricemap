import { useAuthStore } from '@/store/useAuthStore';
import { useApprovalStore } from '@/store/useApprovalStore';
import { can } from '@/lib/permissions';
import type { Permission } from '@/lib/permissions';
import { motion } from 'framer-motion';

interface PermissionGuardProps {
  /** The permission scope being checked (e.g. 'account:delete') */
  permission: Permission;
  /** Content to show when user has direct access */
  children: React.ReactNode;
  /** Optional: Content to show when fully denied (default: hidden) */
  fallback?: React.ReactNode;
  /** Action label used in the approval request description */
  actionLabel?: string;
  /** Payload to include in the approval request */
  payload?: Record<string, unknown>;
}

/**
 * PermissionGuard — wraps any action behind an RBAC check.
 *
 * - allowed        → renders children directly
 * - requires_approval → renders a "Request Approval" button
 * - denied         → renders `fallback` or nothing
 */
export function PermissionGuard({
  permission,
  children,
  fallback = null,
  actionLabel = 'this action',
  payload = {},
}: PermissionGuardProps) {
  const user = useAuthStore(s => s.user);
  const submitRequest = useApprovalStore(s => s.submitRequest);

  const result = can(user?.role, permission);

  if (result === 'allowed') {
    return <>{children}</>;
  }

  if (result === 'requires_approval') {
    return (
      <RequestApprovalButton
        actionLabel={actionLabel}
        onRequest={() =>
          submitRequest(permission, {
            label: actionLabel,
            requestedBy: user?.id,
            ...payload,
          })
        }
      />
    );
  }

  return <>{fallback}</>;
}

// ─── Request Approval Atom ────────────────────────────────────────────────────
function RequestApprovalButton({
  actionLabel,
  onRequest,
}: {
  actionLabel: string;
  onRequest: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onRequest}
      className="h-10 px-4 border border-amber-400/40 bg-amber-400/5 hover:bg-amber-400/10 text-amber-600 dark:text-amber-300 text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
      title={`You need approval to ${actionLabel}`}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
        admin_panel_settings
      </span>
      Request Approval
    </motion.button>
  );
}
