import { Outlet, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { storesApi } from '@/api/stores.api';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/retailer',          icon: 'dashboard',    label: 'Dashboard', end: true },
  { to: '/retailer/products', icon: 'inventory_2',  label: 'Products' },
  { to: '/retailer/promotions',icon: 'sell',        label: 'Promotions' },
  { to: '/retailer/insights', icon: 'bar_chart',    label: 'Insights' },
  { to: '/retailer/sync',     icon: 'sync',         label: 'Connect System' },
  { to: '/retailer/profile',  icon: 'storefront',   label: 'Store Profile' },
];

export function RetailerLayout() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [hasStore, setHasStore] = useState<boolean | null>(null);

  useEffect(() => {
    storesApi.getMine()
      .then(() => setHasStore(true))
      .catch(() => setHasStore(false));
  }, [location.pathname]);

  // While checking, show nothing
  if (hasStore === null) {
    return <div className="h-dvh flex items-center justify-center bg-bg-base"><span className="material-symbols-outlined animate-spin text-text-muted">progress_activity</span></div>;
  }

  // No store yet — force onboarding (unless already on the onboarding page)
  if (!hasStore && !location.pathname.includes('/retailer/setup')) {
    return <Navigate to="/retailer/setup" replace />;
  }

  // Onboarding layout — no sidebar, just the form
  if (!hasStore) {
    return (
      <div className="min-h-dvh bg-bg-base">
        <header className="h-14 border-b border-border-soft bg-white flex items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-[10px] font-black">WA</span>
            </div>
            <span className="font-semibold text-sm text-text-main">WenArkhass</span>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="text-xs font-medium text-text-muted hover:text-red-500 transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Sign out
          </button>
        </header>
        <div className="px-6 py-8">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh flex bg-bg-base overflow-hidden">
      {/* Sidebar - Design System v3 */}
      <aside className="w-56 bg-white border-r border-border-soft flex flex-col shrink-0 overflow-y-auto">
        {/* Brand */}
        <div className="h-14 flex items-center gap-3 px-5 border-b border-border-soft select-none">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white text-[10px] font-black">W.A</span>
          </div>
          <span className="text-sm font-bold text-text-main tracking-tight">WeinArkhas</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn('flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all',
                  isActive
                    ? 'bg-primary text-white font-semibold'
                    : 'font-medium text-text-muted hover:bg-bg-muted hover:text-text-main'
                )
              }
            >
              <span className={cn('material-symbols-outlined text-[20px]', 
                /* Icon color matches text per spec */)}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-border-soft flex flex-col gap-1">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-7 h-7 rounded-full bg-bg-muted flex items-center justify-center text-text-sub text-[10px] font-bold shrink-0">
              {user?.avatarInitials ?? 'WA'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-main truncate">{user?.name?.split(' ')[0]}</p>
              <p className="text-[10px] text-text-muted">Retailer account</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-status-danger hover:bg-status-danger/5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-bg-base overflow-hidden">
        <header className="h-14 bg-bg-surface/90 backdrop-blur-lg border-b border-border-soft flex items-center px-8 gap-4 sticky top-0 z-30">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/app')}
              className="text-xs font-semibold text-text-muted hover:text-text-main transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-soft hover:border-border-primary"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              View storefront
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto animate-page">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
