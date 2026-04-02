import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/api/admin.api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TrustBadge } from '@/components/ui/TrustBadge';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { useToastStore } from '@/store/useToastStore';
import { cn } from '@/lib/utils';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  city?: string;
  avatarInitials?: string;
  trustScore: number;
  uploadCount: number;
}

export function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { open, getParam } = useRouteDialog();
  const addToast = useToastStore((s) => s.addToast);

  const activeUserId = getParam('id');
  const activeUser = users.find((u) => u.id === activeUserId);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await adminApi.getUsers({
          search: search || undefined,
          role: roleFilter !== 'all' ? roleFilter : undefined,
        });
        const data = res.data?.data ?? res.data;
        setUsers(Array.isArray(data) ? data : []);
      } catch {
        // handled by interceptor
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [search, roleFilter]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateUserStatus(id, status);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status } : u))
      );
      addToast(`User ${status === 'warned' ? 'warned' : 'banned'} successfully`);
    } catch {
      addToast('Failed to update user status');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      <h1 className="text-2xl font-bold text-text-main mb-6">User Management</h1>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-bg-surface border border-border-soft rounded-xl px-4 h-10 flex-1 max-w-md">
          <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '18px' }}>search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="bg-transparent border-none outline-none text-sm text-text-main placeholder:text-text-muted flex-1"
          />
        </div>
        {['all', 'shopper', 'retailer', 'admin'].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize',
              roleFilter === role
                ? 'border-primary bg-primary text-white'
                : 'border-border-soft bg-bg-surface text-text-sub hover:border-primary'
            )}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-bg-surface border border-border-soft rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-soft">
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">User</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Role</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">City</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Trust</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Uploads</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-bg-muted hover:bg-primary-soft/40 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-soft text-primary flex items-center justify-center text-xs font-bold">
                        {user.avatarInitials ?? user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-main">{user.name}</p>
                        <p className="text-xs text-text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-text-sub capitalize">{user.role}</td>
                  <td className="py-4 px-4 text-sm text-text-sub">{user.city ?? '—'}</td>
                  <td className="py-4 px-4"><TrustBadge score={user.trustScore} size="sm" /></td>
                  <td className="py-4 px-4 text-sm text-text-sub">{user.uploadCount}</td>
                  <td className="py-4 px-4"><StatusBadge status={user.status} /></td>
                  <td className="py-4 px-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => open('warn-user', { id: user.id })}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--status-pending-bg)] text-[var(--status-pending-text)] hover:opacity-80"
                      >
                        Warn
                      </button>
                      <button
                        onClick={() => open('ban-user', { id: user.id })}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--status-flagged-bg)] text-[var(--status-flagged-text)] hover:opacity-80"
                      >
                        Ban
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-text-muted">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        dialogId="warn-user"
        title="Issue Warning"
        description={`Are you sure you want to issue a formal warning to ${activeUser?.name}? This will appear in their notification history.`}
        confirmLabel="Issue Warning"
        variant="warning"
        onConfirm={() => {
          if (activeUserId) handleUpdateStatus(activeUserId, 'warned');
        }}
      />

      <ConfirmDialog
        dialogId="ban-user"
        title="Ban User"
        description={`CRITICAL: This will permanently ban ${activeUser?.name} and revoke all access to the platform. This action is logged for audit.`}
        confirmLabel="Confirm Ban"
        variant="danger"
        onConfirm={() => {
          if (activeUserId) handleUpdateStatus(activeUserId, 'banned');
        }}
      />
    </motion.div>
  );
}
