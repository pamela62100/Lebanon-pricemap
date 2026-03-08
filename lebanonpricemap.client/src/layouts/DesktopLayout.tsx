import { Outlet } from 'react-router-dom';
import { TopNavbar } from '@/components/ui/TopNavbar';

export function DesktopLayout() {
  return (
    <div className="min-h-dvh bg-bg-base flex flex-col">
      <TopNavbar />
      <main className="flex-1 w-full bg-bg-base overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
