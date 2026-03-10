import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/ui/AdminSidebar';
import { ExchangeRateBanner } from '@/components/ui/ExchangeRateBanner';

export function AdminLayout() {
  return (
    <div className="min-h-dvh flex flex-col bg-bg-base selection:bg-primary/20 selection:text-text-main">
      <ExchangeRateBanner />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 min-w-0 flex flex-col bg-bg-base">
          {/* Top Header - v3 */}
          <header className="h-14 bg-bg-surface/90 backdrop-blur-lg border-b border-border-soft flex items-center justify-between px-8 sticky top-0 z-30">
            <div>
              <p className="text-sm font-bold text-text-main leading-none">Admin Panel</p>
              <p className="text-[9px] font-data text-text-muted uppercase tracking-[0.2em] mt-1 font-black">System Authority</p>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button className="relative w-9 h-9 flex items-center justify-center rounded-full text-text-muted hover:bg-bg-muted hover:text-text-main transition-colors">
                <span className="material-symbols-outlined text-[18px]">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-status-danger" />
              </button>
              
              <div className="w-px h-6 bg-border-soft mx-2" />
              
              <div className="flex items-center gap-2 pl-1 pr-3 py-1 bg-bg-surface border border-border-soft rounded-full">
                <div className="w-7 h-7 rounded-full bg-text-main text-white flex items-center justify-center text-[10px] font-bold">
                  SA
                </div>
                <span className="text-xs font-semibold text-text-main hidden sm:block">Master Admin</span>
              </div>
            </div>
          </header>

          <div className="flex-1 p-8 md:p-12 overflow-y-auto">
            <div className="max-w-6xl mx-auto animate-page">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
