import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { pricesApi } from '@/api/prices.api';
import { alertsApi } from '@/api/alerts.api';
import { usersApi } from '@/api/users.api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { RouteDialog } from '@/components/dialogs/RouteDialog';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { useToastStore } from '@/store/useToastStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PriceEntry } from '@/types';

interface TrackedAlert {
  id: string;
  productName: string;
}

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const logout = useAuthStore((s) => s.logout);
  const { open, close } = useRouteDialog();
  const addToast = useToastStore((s) => s.addToast);
  const navigate = useNavigate();

  const [myEntries, setMyEntries] = useState<PriceEntry[]>([]);
  const [trackedAlerts, setTrackedAlerts] = useState<TrackedAlert[]>([]);
  const [editName, setEditName] = useState(user?.name ?? '');
  const [editCity, setEditCity] = useState(user?.city ?? '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    pricesApi.getByUser(user.id).then((res) => {
      const data = res.data?.data ?? res.data;
      setMyEntries(Array.isArray(data) ? data : []);
    }).catch(() => {});

    alertsApi.getAll().then((res) => {
      const data = res.data?.data ?? res.data;
      setTrackedAlerts(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, [user?.id]);

  const saveProfile = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      await usersApi.update(user.id, { name: editName, city: editCity });
      updateUser({ name: editName, city: editCity });
      addToast('Profile updated');
      close();
    } catch {
      addToast('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="px-6 lg:px-8 py-8 animate-page">
      <div className="flex flex-col gap-8">

        {/* Profile hero */}
        <header className="card-dark p-7 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
            </svg>
          </div>

          <div className="relative z-10 shrink-0">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-white text-text-main rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold shadow-xl">
              {user.avatarInitials}
            </div>
            <button
              onClick={() => open('edit-profile')}
              className="absolute -bottom-1.5 -right-1.5 w-9 h-9 bg-white text-text-main rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border-2 border-text-main"
              title="Edit profile"
            >
              <span className="material-symbols-outlined text-base">edit</span>
            </button>
          </div>

          <div className="flex-1 text-center md:text-left relative z-10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 mb-5">
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                  Your account
                </p>
                <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-none">
                  {user.name}
                </h1>
              </div>
              <div className="px-4 py-3 bg-white/10 rounded-xl border border-white/10 backdrop-blur-xl text-center md:text-left">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">
                  Trust score
                </p>
                <div className="flex items-baseline gap-2 justify-center md:justify-start">
                  <span className="text-2xl font-bold text-white font-data">
                    {user.trustScore}
                  </span>
                  <span className="text-[10px] font-bold text-green-400 uppercase">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[11px] font-medium text-white/60">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-white/40">mail</span>
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-white/40">location_on</span>
                {user.city}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-white/40">calendar_today</span>
                Member since {new Date(user.joinedAt).getFullYear()}
              </span>
            </div>
          </div>
        </header>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="card p-5 md:p-6 group hover:bg-text-main hover:text-white transition-all duration-300">
            <p className="text-[10px] font-semibold text-text-muted group-hover:text-white/50 uppercase tracking-widest mb-1.5">
              Price reports
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-data tracking-tight">
                {user.uploadCount}
              </span>
              <span className="text-xs font-medium opacity-40 uppercase">total</span>
            </div>
          </div>

          <div className="card p-5 md:p-6 border-green-400/20 bg-green-500/5 group hover:bg-green-500 hover:text-white transition-all duration-300">
            <p className="text-[10px] font-semibold text-green-600 group-hover:text-white/50 uppercase tracking-widest mb-1.5">
              Verified
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-data tracking-tight text-green-600 group-hover:text-white">
                {user.verifiedCount}
              </span>
              <span className="text-xs font-medium opacity-40 uppercase">reports</span>
            </div>
          </div>

          <div className="card p-5 md:p-6 lg:col-span-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-1">
                Community level
              </p>
              <p className="text-base font-bold text-text-main">Gold Contributor</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <span className="material-symbols-outlined text-xl">workspace_premium</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Submission history */}
          <section className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-main tracking-tight">
                My submissions
              </h2>
              <span className="px-2.5 py-1 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-wide">
                {myEntries.length} reports
              </span>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-bg-muted/40 border-b border-border-soft">
                      <th className="py-3.5 px-5 text-[10px] font-semibold text-text-muted uppercase tracking-wide">
                        Product
                      </th>
                      <th className="py-3.5 px-5 text-[10px] font-semibold text-text-muted uppercase tracking-wide">
                        Price (LBP)
                      </th>
                      <th className="py-3.5 px-5 text-[10px] font-semibold text-text-muted uppercase tracking-wide text-center">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-soft/40">
                    {myEntries.slice(0, 10).map((entry) => (
                      <tr
                        key={entry.id}
                        className="group hover:bg-bg-muted/20 transition-colors"
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-bg-muted flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                              <span className="material-symbols-outlined text-base">
                                inventory_2
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-text-main truncate">
                                {entry.product?.name}
                              </p>
                              <p className="text-[10px] text-text-muted truncate mt-0.5">
                                {entry.store?.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <p className="text-base font-bold text-text-main font-data tracking-tight">
                            {entry.priceLbp.toLocaleString()}
                          </p>
                        </td>
                        <td className="py-4 px-5 text-center">
                          <StatusBadge status={entry.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {myEntries.length === 0 && (
                <div className="p-16 flex flex-col items-center text-center">
                  <span className="material-symbols-outlined text-4xl text-text-muted/20 mb-4">
                    receipt_long
                  </span>
                  <p className="text-sm font-semibold text-text-muted mb-1">
                    No submissions yet
                  </p>
                  <p className="text-sm text-text-muted/60 max-w-xs">
                    Start reporting prices at local stores to help your community.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Tracked products */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">
                Tracked products
              </h3>
              <div className="space-y-2">
                {trackedAlerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3.5 rounded-xl bg-white border border-border-soft flex items-center justify-between hover:border-text-main/20 transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-text-main truncate">
                        {alert.productName}
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">Active alert</p>
                    </div>
                    <span className="material-symbols-outlined text-base text-text-muted/30 group-hover:text-text-muted transition-colors shrink-0">
                      arrow_forward_ios
                    </span>
                  </div>
                ))}
                {trackedAlerts.length === 0 && (
                  <p className="text-xs text-text-muted/60 py-2">No active alerts.</p>
                )}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-red-50 border border-red-200">
              <p className="text-sm font-semibold text-red-700 mb-1">Delete account</p>
              <p className="text-xs text-text-muted mb-3">
                Permanently remove your account. This cannot be undone.
              </p>
              <button
                onClick={async () => {
                  if (!confirm('Are you sure? Your account will be permanently deleted.')) return;
                  try {
                    await usersApi.deleteMyAccount();
                    addToast('Account deleted', 'info');
                    logout();
                    navigate('/');
                  } catch {
                    addToast('Failed to delete account', 'error');
                  }
                }}
                className="w-full h-10 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all"
              >
                Delete my account
              </button>
            </div>

          </aside>
        </div>
      </div>

      {/* Dialogs */}
      <RouteDialog
        dialogId="edit-profile"
        title="Edit profile"
        description="Update your display name and city."
      >
        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">
              Display name
            </p>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full h-12 bg-bg-muted border-none rounded-xl px-4 text-sm font-semibold focus:ring-2 focus:ring-text-main/10 transition-all"
            />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">
              City
            </p>
            <input
              value={editCity}
              onChange={(e) => setEditCity(e.target.value)}
              className="w-full h-12 bg-bg-muted border-none rounded-xl px-4 text-sm font-semibold focus:ring-2 focus:ring-text-main/10 transition-all"
            />
          </div>
          <button
            onClick={saveProfile}
            disabled={isSaving}
            className="btn-primary w-full h-12 rounded-xl shadow-lg shadow-text-main/10 mt-2 disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </RouteDialog>

    </div>
  );
}
