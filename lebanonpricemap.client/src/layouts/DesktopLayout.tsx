import { Outlet } from 'react-router-dom';
import { TopNavbar } from '@/components/ui/TopNavbar';
import { ExchangeRateBanner } from '@/components/ui/ExchangeRateBanner';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { GlobalEssentialsTicker } from '@/components/ui/GlobalEssentialsTicker';

export function DesktopLayout() {
  return (
    <div className="min-h-dvh bg-bg-base flex flex-col">
      {/* Sticky chrome */}
      <div className="sticky top-0 z-40 flex flex-col w-full shrink-0" data-sticky-header>
        <ExchangeRateBanner />
        <OfflineBanner />
        <TopNavbar />
        <GlobalEssentialsTicker />
      </div>

      {/* Normal scrolling for all pages */}
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}