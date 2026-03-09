import { Outlet } from 'react-router-dom';
import { TopNavbar } from '@/components/ui/TopNavbar';
import { ExchangeRateBanner } from '@/components/ui/ExchangeRateBanner';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { GlobalEssentialsTicker } from '@/components/ui/GlobalEssentialsTicker';

export function DesktopLayout() {
  return (
    <div className="min-h-dvh bg-bg-base flex flex-col">
      <ExchangeRateBanner />
      <OfflineBanner />
      <TopNavbar />
      <GlobalEssentialsTicker />
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
