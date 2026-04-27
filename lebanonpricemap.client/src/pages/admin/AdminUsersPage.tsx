import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

function AddUserDialog({ onCreated, onClose }: { onCreated: (user: AdminUser) => void; onClose: () => void }) {
  const addToast = useToastStore((s) => s.addToast);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'shopper', city: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Name, email and password are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    try {
      const res = await adminApi.createUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        city: form.city.trim() || undefined,
      });
      const data = (res as any).data?.data ?? (res as any).data;
      addToast(`User ${form.name} created`, 'success');
      onCreated({
        id: data.id,
        name: form.name,
        email: form.email,
        role: form.role,
        status: 'active',
        city: form.city || undefined,
        avatarInitials: data.avatarInitials,
        trustScore: data.trustScore ?? 50,
        uploadCount: 0,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Failed to create user.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 16, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 340 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white rounded-2xl border border-border-primary shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b border-border-soft flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text-main">Create new user</h2>
              <p className="text-xs text-text-muted mt-0.5">The user will be able to log in immediately.</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-bg-muted flex items-center justify-center text-text-muted hover:text-text-main transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          {/* Form */}
          <div className="px-6 py-5 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-red-500 text-[16px]">error</span>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Full name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[16px]">person</span>
                <input
                  type="text"
                  placeholder="e.g. Habib Nassar"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-bg-muted border border-border-primary rounded-xl text-sm text-text-main placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/5 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Email address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[16px]">mail</span>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-bg-muted border border-border-primary rounded-xl text-sm text-text-main placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/5 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[16px]">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  className="w-full h-10 pl-10 pr-10 bg-bg-muted border border-border-primary rounded-xl text-sm text-text-main placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/5 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Role</label>
              <div className="grid grid-cols-3 gap-2">
                {(['shopper', 'retailer', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => set('role', r)}
                    className={cn(
                      'h-9 rounded-xl border text-xs font-semibold capitalize transition-all',
                      form.role === r
                        ? 'bg-primary text-white border-primary'
                        : 'bg-bg-muted text-text-muted border-border-primary hover:border-primary/30'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* City (optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">City <span className="normal-case font-normal">(optional)</span></label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[16px]">location_on</span>
                <input
                  type="text"
                  placeholder="e.g. Beirut"
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-bg-muted border border-border-primary rounded-xl text-sm text-text-main placeholder:text-text-muted/50 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/5 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-border-soft text-sm font-semibold text-text-muted hover:text-text-main hover:border-text-main/20 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 h-10 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="material-symbols-outlined text-[16px]"
                  >progress_activity</motion.span>
                  Creating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  Create user
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
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
      const label =
        status === 'warned' ? 'warned' :
        status === 'suspended' ? 'suspended' :
        status === 'active' ? 'reactivated' : 'updated';
      addToast(`User ${label} successfully`, status === 'suspended' ? 'error' : 'info');
    } catch {
      addToast('Failed to update user status', 'error');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-main">User Management</h1>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center gap-2 h-10 px-5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Add user
        </button>
      </div>

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
                      {user.status === 'suspended' ? (
                        <button
                          onClick={() => handleUpdateStatus(user.id, 'active')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                        >
                          Reactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => open('suspend-user', { id: user.id })}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          Suspend
                        </button>
                      )}
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

      {showAddUser && (
        <AddUserDialog
          onClose={() => setShowAddUser(false)}
          onCreated={(newUser) => {
            setUsers((prev) => [newUser, ...prev]);
            setShowAddUser(false);
          }}
        />
      )}

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
        dialogId="suspend-user"
        title="Suspend user"
        description={`This will revoke ${activeUser?.name}'s access. They won't be able to log in until reactivated.`}
        confirmLabel="Suspend user"
        variant="danger"
        onConfirm={() => {
          if (activeUserId) handleUpdateStatus(activeUserId, 'suspended');
        }}
      />
    </motion.div>
  );
}
