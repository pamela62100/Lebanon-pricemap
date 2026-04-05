import { Outlet, NavLink } from 'react-router-dom';
import { TopNavbar } from '@/components/ui/TopNavbar';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { GlobalEssentialsTicker } from '@/components/ui/GlobalEssentialsTicker';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';

const MOBILE_NAV = [
  { icon: 'search',               path: '/app',         title: 'Search', end: true  },
  { icon: 'storefront',           path: '/app/catalog', title: 'Stores', end: false },
  { icon: 'barcode_scanner',      path: '/app/scan',    title: 'Scan',   end: false },
  { icon: 'local_gas_station',    path: '/app/fuel',    title: 'Fuel',   end: false },
  { icon: 'checklist',            path: '/app/list',    title: 'My List',end: false },
];

export function DesktopLayout() {
  const totalItems = useCartStore((s) => s.totalItemCount());

  return (
    <div className="min-h-dvh bg-bg-base flex flex-col">
      {/* Sticky top chrome */}
      <div className="sticky top-0 z-40 flex flex-col w-full shrink-0" data-sticky-header>
        <OfflineBanner />
        <TopNavbar />
        <GlobalEssentialsTicker />
      </div>

      {/* Page content — extra bottom padding on mobile for bottom nav */}
      <main className="flex-1 w-full overflow-x-hidden pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom nav — hidden on md+ */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-border-soft flex items-center">
        {MOBILE_NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => cn(
              'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative',
              isActive ? 'text-primary' : 'text-text-muted'
            )}
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.title}</span>
            {item.path === '/app/list' && totalItems > 0 && (
              <span className="absolute top-1.5 right-1/4 w-3.5 h-3.5 rounded-full bg-primary text-white text-[8px] font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
