import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { storesApi } from '@/api/stores.api';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import type { Store } from '@/types';

const NAV_ITEMS = [
  { to: '/retailer',           icon: 'dashboard',   label: 'Dashboard',  end: true },
  { to: '/retailer/products',  icon: 'inventory_2', label: 'Products' },
  { to: '/retailer/promotions',icon: 'sell',        label: 'Promotions' },
  { to: '/retailer/upload',    icon: 'upload_file', label: 'Upload CSV' },
  { to: '/retailer/profile',   icon: 'storefront',  label: 'Store Profile' },
];

export function RetailerLayout() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    storesApi.getMine().then(res => {
      const s = res.data?.data ?? res.data;
      if (s?.id) setStore(s);
    }).catch(() => {});
  }, []);

  return (
    <div className="h-dvh flex bg-bg-base overflow-hidden">
      <aside className="w-56 bg-white border-r border-border-soft flex flex-col shrink-0 overflow-y-auto">
        {/* Brand */}
        <div className="h-14 flex items-center gap-3 px-5 border-b border-border-soft select-none">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white text-[10px] font-black">W.A</span>
          </div>
          <span className="text-sm font-bold text-text-main tracking-tight">WeinArkhas</span>
        </div>

        {/* Store chip */}
        {store && (
          <div className="mx-3 mt-4 mb-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-bg-muted border border-border-soft">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-xs shrink-0">
              {store.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-text-main truncate">{store.name}</p>
              <p className="text-[10px] text-text-muted truncate">{store.city}</p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 flex flex-col gap-1 overflow-y-auto">
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
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
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
          {store ? (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-text-muted">storefront</span>
              <span className="text-sm font-semibold text-text-main">{store.name}</span>
              <span className="text-text-muted/40 text-xs">·</span>
              <span className="text-xs text-text-muted">{store.city}</span>
            </div>
          ) : (
            <div className="h-4 w-32 rounded bg-bg-muted animate-pulse" />
          )}
          <div className="flex-1" />
          <button
            onClick={() => navigate('/app')}
            className="text-xs font-semibold text-text-muted hover:text-text-main transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-soft hover:border-border-primary"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            View storefront
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="w-full animate-page">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
