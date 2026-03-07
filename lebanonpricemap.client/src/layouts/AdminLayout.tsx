import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/ui/AdminSidebar';

export function AdminLayout() {
  return (
    <div className="min-h-dvh flex bg-bg-base font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden flex flex-col">
        {/* Top Header for Admin */}
        <header className="h-20 bg-bg-surface/80 backdrop-blur-md border-b border-border-soft flex items-center justify-between px-10 sticky top-0 z-30">
          <div>
            <h2 className="text-xl font-bold text-text-main tracking-tight">Admin Portal</h2>
            <p className="text-sm text-text-muted mt-0.5">Manage the Wein Arkhas community</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 rounded-full bg-bg-muted flex items-center justify-center text-text-sub hover:bg-border-soft transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--status-flagged-text)] border border-bg-surface"></span>
            </button>
            <div className="h-8 w-px bg-border-soft hidden sm:block"></div>
            <div className="flex items-center gap-3 bg-bg-muted/50 pl-2 pr-4 py-1.5 rounded-full border border-border-soft cursor-pointer hover:border-primary transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                AD
              </div>
              <span className="text-sm font-semibold text-text-main hidden sm:block">Admin User</span>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
