import { Outlet } from 'react-router-dom';
import { TopNavbar } from '@/components/ui/TopNavbar';
import { ExchangeRateBanner } from '@/components/ui/ExchangeRateBanner';
import { OfflineBanner } from '@/components/ui/OfflineBanner';

export function DesktopLayout() {
  return (
    <div className="min-h-dvh bg-bg-base flex flex-col blueprint-grid">
      <ExchangeRateBanner />
      <OfflineBanner />
      <TopNavbar />
      <main className="flex-1 w-full bg-bg-base/50 overflow-x-hidden relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
