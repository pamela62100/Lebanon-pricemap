import { useState } from 'react';
import { motion } from 'framer-motion';
import { MOCK_USERS } from '@/api/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TrustBadge } from '@/components/ui/TrustBadge';
import { cn } from '@/lib/utils';

export function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = MOCK_USERS.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      <h1 className="text-2xl font-bold text-text-main mb-6">User Management</h1>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-bg-surface border border-border-soft rounded-xl px-4 h-10 flex-1 max-w-md">
          <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '18px' }}>search</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="bg-transparent border-none outline-none text-sm text-text-main placeholder:text-text-muted flex-1" />
        </div>
        {['all', 'shopper', 'retailer', 'admin'].map(role => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium border transition-all capitalize',
              roleFilter === role ? 'border-primary bg-primary text-white' : 'border-border-soft bg-bg-surface text-text-sub hover:border-primary'
            )}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-bg-surface border border-border-soft rounded-xl overflow-hidden">
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
            {filtered.map(user => (
              <tr key={user.id} className="border-b border-bg-muted hover:bg-primary-soft/40 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-soft text-primary flex items-center justify-center text-xs font-bold">
                      {user.avatarInitials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-main">{user.name}</p>
                      <p className="text-xs text-text-muted">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-text-sub capitalize">{user.role}</td>
                <td className="py-4 px-4 text-sm text-text-sub">{user.city}</td>
                <td className="py-4 px-4"><TrustBadge score={user.trustScore} size="sm" /></td>
                <td className="py-4 px-4 text-sm text-text-sub">{user.uploadCount}</td>
                <td className="py-4 px-4"><StatusBadge status={user.status} /></td>
                <td className="py-4 px-4">
                  <div className="flex gap-1">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--status-pending-bg)] text-[var(--status-pending-text)] hover:opacity-80">
                      Warn
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--status-flagged-bg)] text-[var(--status-flagged-text)] hover:opacity-80">
                      Ban
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
