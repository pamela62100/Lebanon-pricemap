import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useApprovalStore } from '@/store/useApprovalStore';

const navItems = [
  { path: '/admin',           icon: 'dashboard',            label: 'Dashboard' },
  { path: '/admin/approvals', icon: 'admin_panel_settings', label: 'Approval Queue',  badge: true },
  { path: '/admin/users',     icon: 'group',                label: 'Users' },
  { path: '/admin/products',  icon: 'inventory_2',          label: 'Products' },
  { path: '/admin/stores',    icon: 'storefront',           label: 'Stores' },
  { path: '/admin/flagged',   icon: 'flag',                 label: 'Flagged Prices' },
  { path: '/admin/anomalies', icon: 'warning',              label: 'Anomalies' },
  { path: '/admin/logs',      icon: 'history',              label: 'Activity Logs' },
  { path: '/admin/onboarding',icon: 'rocket_launch',        label: 'Onboarding' },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggle } = useThemeStore();
  const logout = useAuthStore(s => s.logout);
  const pendingCount = useApprovalStore(s => s.pendingCount());

  return (
    <aside className="w-64 flex-shrink-0 bg-bg-surface border-r border-text-main flex flex-col h-dvh sticky top-0 blueprint-grid">
      {/* Logo - Architectural Monogram */}
      <div className="px-6 py-10 select-none border-b border-border-primary/50 bg-bg-base/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-text-main flex items-center justify-center shadow-[2px_2px_0px_#0066FF]">
            <span className="text-bg-base text-lg font-serif font-black tracking-tighter">WW</span>
          </div>
          <div>
            <h2 className="text-sm font-black text-text-main font-serif tracking-tight uppercase">Wein Wrkhas</h2>
            <p className="text-[9px] text-primary uppercase font-bold tracking-[0.2em] mt-0.5">Admin Protocol</p>
          </div>
        </div>
      </div>

      {/* Nav items - Technical List */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.path === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border',
                isActive
                  ? 'bg-text-main text-bg-base border-text-main shadow-[2px_2px_0px_#0066FF]'
                  : 'text-text-muted border-transparent hover:border-border-soft hover:bg-bg-muted/50 hover:text-text-main'
              )}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge && pendingCount > 0 && (
                <span className="ml-auto min-w-[18px] h-[18px] bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom actions - Control Panel */}
      <div className="px-3 pb-8 flex flex-col gap-1 border-t border-border-primary/50 pt-6">
        <button
          onClick={() => navigate('/app')}
          className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-text-muted hover:text-text-main hover:bg-bg-muted transition-all w-full text-left uppercase tracking-widest"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>terminal</span>
          Terminal View
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-red-600 hover:bg-red-50 transition-all w-full text-left uppercase tracking-widest"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>power_settings_new</span>
          SHUTDOWN
        </button>
      </div>
    </aside>
  );
}
