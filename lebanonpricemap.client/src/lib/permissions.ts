import type { UserRole } from '@/types';

// ─── Scope Definitions ───────────────────────────────────────────────────────
// Permissions follow the principle of least privilege.
// Format: 'resource:action'

type Permission =
  | 'prices:read'
  | 'prices:submit'
  | 'prices:moderate'
  | 'receipt:upload'
  | 'cart:manage'
  | 'alert:manage'
  | 'store:manage'
  | 'store:verify'
  | 'users:manage'
  | 'account:delete'
  | 'bulk:delete'
  | 'promotion:manage';

type PermissionResult = 'allowed' | 'requires_approval' | 'denied';

// ─── Role Permission Map ──────────────────────────────────────────────────────
const DIRECT_PERMISSIONS: Record<UserRole, Permission[]> = {
  shopper: ['prices:read', 'cart:manage', 'alert:manage'],
  retailer: [
    'prices:read', 'prices:submit',
    'cart:manage', 'alert:manage',
    'store:manage', 'promotion:manage',
  ],
  admin: [
    'prices:read', 'prices:submit', 'prices:moderate',
    'cart:manage', 'alert:manage',
    'store:manage', 'store:verify', 'promotion:manage',
    'users:manage', 'account:delete', 'bulk:delete',
  ],
};

// Actions that require admin approval rather than direct execution.
// These permissions will show "Request Approval" for lower-privileged roles.
const APPROVAL_ESCALATION_MAP: Partial<Record<Permission, UserRole[]>> = {
  'account:delete': ['shopper', 'retailer'],
  'bulk:delete':    ['shopper', 'retailer'],
  'store:verify':   ['retailer'],
  'prices:moderate': ['retailer'],
};

// ─── Core Permission Check ────────────────────────────────────────────────────
/**
 * Check if a user role can perform an action.
 * Returns 'allowed', 'requires_approval', or 'denied'.
 */
export function can(role: UserRole | undefined | null, permission: Permission): PermissionResult {
  if (!role) return 'denied';

  // Admin can do everything directly
  if (role === 'admin' && DIRECT_PERMISSIONS.admin.includes(permission)) {
    return 'allowed';
  }

  // Check approval escalation first
  const rolesRequiringApproval = APPROVAL_ESCALATION_MAP[permission];
  if (rolesRequiringApproval?.includes(role)) {
    return 'requires_approval';
  }

  // Check direct permissions
  if (DIRECT_PERMISSIONS[role]?.includes(permission)) {
    return 'allowed';
  }

  return 'denied';
}

/**
 * Convenience: returns true if the role has direct access (no approval needed).
 */
export function hasPermission(role: UserRole | undefined | null, permission: Permission): boolean {
  return can(role, permission) === 'allowed';
}

export type { Permission, PermissionResult };
