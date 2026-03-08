import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/retailer',          icon: 'dashboard',    label: 'Dashboard', end: true },
  { to: '/retailer/products', icon: 'inventory_2',  label: 'Products' },
  { to: '/retailer/promotions',icon: 'sell',        label: 'Promotions' },
  { to: '/retailer/insights', icon: 'bar_chart',    label: 'Insights' },
  { to: '/retailer/sync',     icon: 'sync',         label: 'Sync / API' },
  { to: '/retailer/profile',  icon: 'storefront',   label: 'Store Profile' },
];

export function RetailerLayout() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh flex bg-bg-base font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-bg-surface border-r border-border-soft flex flex-col sticky top-0 h-dvh overflow-y-auto shrink-0">
        {/* Brand */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-border-soft select-none">
          <div className="w-10 h-10 rounded-xl bg-bg-base border border-border-primary flex items-center justify-center shadow-gold">
            <span className="text-primary text-xl font-serif font-black tracking-tighter">WW</span>
          </div>
          <div>
            <p className="text-sm font-black text-text-main font-serif leading-none">Wein Wrkhas</p>
            <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-black mt-1">Retailer</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-sub hover:bg-bg-muted hover:text-text-main'
                )
              }
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-border-soft flex flex-col gap-2">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
              {user?.avatarInitials ?? 'HN'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-text-main truncate">{user?.name ?? 'Retailer'}</p>
              <p className="text-[10px] text-text-muted">Store Owner</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-text-muted hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-x-hidden">
        <header className="h-16 bg-bg-surface/80 backdrop-blur-md border-b border-border-soft flex items-center px-8 gap-3 sticky top-0 z-30">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/app')} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border-soft text-text-sub hover:border-primary hover:text-primary transition-all">
              Browse as Shopper
            </button>
          </div>
        </header>
        <div className="p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
