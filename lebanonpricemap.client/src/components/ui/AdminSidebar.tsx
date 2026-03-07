import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';

const navItems = [
  { path: '/app/admin',          icon: 'dashboard',     label: 'Dashboard' },
  { path: '/app/admin/users',    icon: 'group',         label: 'Users' },
  { path: '/app/admin/products', icon: 'inventory_2',   label: 'Products' },
  { path: '/app/admin/logs',     icon: 'history',       label: 'Activity Logs' },
];

export function AdminSidebar() {
  const location = useLocation();
  const { isDark, toggle } = useThemeStore();
  const logout = useAuthStore(s => s.logout);

  return (
    <aside className="w-60 flex-shrink-0 bg-bg-surface border-r border-border-soft flex flex-col h-screen">
      {/* Logo */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-primary">
          <span className="mr-2">🔥</span>Wein Arkhas
        </h2>
        <p className="text-xs text-text-muted mt-1">Admin Panel</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = item.path === '/app/admin'
            ? location.pathname === '/app/admin'
            : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary-soft text-primary font-semibold'
                  : 'text-text-sub hover:bg-bg-muted hover:text-text-main'
              )}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px', fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-6 flex flex-col gap-1">
        <button
          onClick={toggle}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-sub hover:bg-bg-muted transition-all w-full text-left"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[var(--status-flagged-text)] hover:bg-[var(--status-flagged-bg)] transition-all w-full text-left"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
