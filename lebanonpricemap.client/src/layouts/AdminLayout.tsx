import { Outlet, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/ui/AdminSidebar';
import { ExchangeRateBanner } from '@/components/ui/ExchangeRateBanner';
import { useAuthStore } from '@/store/useAuthStore';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminLayout() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="h-dvh flex flex-col bg-bg-base overflow-hidden">
      <ExchangeRateBanner />
      <div className="flex flex-1 min-h-0">
        <AdminSidebar />
        <main className="flex-1 min-w-0 flex flex-col bg-bg-base overflow-hidden">
          <header className="h-14 bg-white border-b border-border-soft flex items-center justify-between px-6 shrink-0">
            <p className="text-sm font-semibold text-text-main">Administration</p>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="flex items-center gap-2 pl-1 pr-2.5 h-8 rounded-lg border border-border-soft hover:bg-bg-muted transition-all"
              >
                <div className="w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center text-[11px] font-bold">
                  {user?.avatarInitials ?? 'A'}
                </div>
                <span className="text-sm font-medium text-text-main hidden sm:block max-w-[120px] truncate">
                  {user?.name}
                </span>
                <span className="material-symbols-outlined text-[14px] text-text-muted">expand_more</span>
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-border-soft shadow-lg p-2 z-[200]"
                  >
                    <div className="px-3 py-2.5 border-b border-border-soft mb-1">
                      <p className="font-semibold text-text-main text-sm truncate">{user?.name}</p>
                      <p className="text-xs text-text-muted truncate mt-0.5">{user?.email}</p>
                      <span className="mt-1.5 inline-block px-2 py-0.5 rounded-full bg-bg-muted text-text-main text-xs font-medium capitalize">
                        {user?.role}
                      </span>
                    </div>
                    <button
                      onClick={() => { setMenuOpen(false); navigate('/app/profile'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-main hover:bg-bg-muted transition-all"
                    >
                      <span className="material-symbols-outlined text-[17px] text-text-muted">account_circle</span>
                      Account
                    </button>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); navigate('/login'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all"
                    >
                      <span className="material-symbols-outlined text-[17px]">logout</span>
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="animate-page">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
