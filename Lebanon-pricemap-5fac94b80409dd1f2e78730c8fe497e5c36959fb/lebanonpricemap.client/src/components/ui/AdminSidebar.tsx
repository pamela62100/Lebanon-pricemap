import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
  const logout = useAuthStore(s => s.logout);
  const pendingCount = useApprovalStore(s => s.pendingCount());

  return (
    <aside className="w-56 bg-white border-r border-border-soft flex flex-col h-dvh sticky top-0 shrink-0 z-40">
      {/* Brand area */}
      <div className="h-14 flex items-center gap-3 px-5 border-b border-border-soft select-none">
        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
          <span className="text-white text-[10px] font-black">W.A</span>
        </div>
        <span className="text-sm font-bold text-text-main tracking-tight">WeinArkhas</span>
      </div>

      {/* Context Ticker - The Whisper */}
      <div className="px-5 py-3 border-b border-border-soft flex items-center justify-between">
        <span className="text-[9px] font-data font-black text-text-muted uppercase tracking-widest">System_Protocol</span>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-status-verified/5 border border-status-verified/10">
          <div className="w-1 h-1 rounded-full bg-status-verified" />
          <span className="text-[9px] font-data font-black text-status-verified uppercase tracking-wider">Active</span>
        </div>
      </div>

      {/* Nav items */}
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
                'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all',
                isActive
                  ? 'bg-primary text-white font-semibold shadow-sm'
                  : 'font-medium text-text-muted hover:bg-bg-muted hover:text-text-main'
              )}
            >
              <span className="material-symbols-outlined text-[18px]">
                {item.icon}
              </span>
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && pendingCount > 0 && (
                <span className={cn(
                  "font-data text-[9px] font-black px-2 py-0.5 rounded-md",
                  isActive ? "bg-white/20 text-white" : "bg-primary text-white"
                )}>
                  {pendingCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User footer / Bottom actions */}
      <div className="p-3 border-t border-border-soft flex flex-col gap-1">
        <button
          onClick={() => navigate('/app')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-text-muted hover:text-text-main transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">visibility</span>
          Shopper_View
        </button>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-status-danger hover:bg-status-danger/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
