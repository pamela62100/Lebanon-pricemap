import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const TRUST_COLORS = (score: number) =>
  score >= 75 ? 'text-green-500 bg-green-500/10 border-green-500/20' :
  score >= 50 ? 'text-amber-500 bg-amber-400/10 border-amber-400/20' :
                'text-red-500 bg-red-400/10 border-red-400/20';

const ROLE_COLORS: Record<string, string> = {
  admin:    'bg-red-400/10 text-red-500 border-red-400/20',
  retailer: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/20',
  shopper:  'bg-primary/10 text-primary border-primary/20',
};

export function TopNavbar() {
  const navigate = useNavigate();
  const user    = useAuthStore(s => s.user);
  const logout  = useAuthStore(s => s.logout);
  const totalItems = useCartStore(s => s.totalItemCount());

  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const profilePath = user?.role === 'retailer' ? '/retailer/profile' : '/app/profile';

  return (
    <div className="sticky top-0 z-50 w-full bg-bg-surface/95 backdrop-blur-lg border-b border-border-soft">
      <nav className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">

        {/* Logo area */}
        <div
          className="flex items-center gap-2.5 select-none cursor-pointer group"
          onClick={() => navigate(user ? '/app' : '/')}
        >
          <div className="w-8 h-8 bg-text-main rounded-xl flex items-center justify-center transition-all group-hover:opacity-90">
            <span className="text-white text-[10px] font-black tracking-tight">W.A</span>
          </div>
          <span className="text-base font-bold text-text-main tracking-tight hidden sm:block">
            WeinArkhas
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1">

          {user ? (
            <>
              {/* Desktop Nav cluster */}
              <div className="hidden md:flex items-center gap-1">
                {[
                  { icon: 'storefront',         path: '/app/catalog',       title: 'Retailer Catalog' },
                  { icon: 'barcode_scanner',    path: '/app/scan',          title: 'Scan' },
                  { icon: 'local_gas_station',  path: '/app/fuel',          title: 'Fuel' },
                  { icon: 'notifications_active', path: '/app/alerts',      title: 'Alerts' },
                ].map(item => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="w-9 h-9 flex items-center justify-center text-text-muted hover:bg-bg-muted hover:text-text-main rounded-full transition-colors"
                    title={item.title}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  </button>
                ))}
              </div>

              {/* Cart */}
              <button
                onClick={() => navigate('/app/cart')}
                className="relative w-9 h-9 flex items-center justify-center text-text-muted hover:bg-bg-muted hover:text-text-main rounded-full transition-colors"
                title="Cart"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-text-main text-white text-[8px] font-bold flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>

              <div className="w-px h-6 bg-border-soft mx-2" />

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={cn(
                    'h-9 pl-1 pr-3 flex items-center gap-2 rounded-full border transition-all',
                    profileOpen ? 'bg-primary text-white border-primary' : 'border-border-primary hover:bg-bg-muted'
                  )}
                >
                  <div className="w-7 h-7 rounded-full bg-text-main text-white flex items-center justify-center text-[10px] font-bold">
                    {user.avatarInitials}
                  </div>
                  <span className="hidden lg:block text-xs font-semibold">
                    {user.name?.split(' ')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 glass z-50 overflow-hidden p-1.5"
                    >
                      {/* Profile header */}
                      <div className="p-3 mb-1 border-b border-border-soft/50">
                        <p className="font-bold text-text-main text-sm truncate">{user.name}</p>
                        <p className="text-[10px] text-text-muted font-data truncate mt-0.5">{user.email}</p>
                        
                        <div className="flex items-center gap-1.5 mt-3">
                          <span className={cn('badge', 
                            user.role === 'admin' ? 'bg-red-100 text-red-600' : 
                            user.role === 'retailer' ? 'bg-blue-100 text-blue-700' : 'bg-bg-muted text-text-sub')}>
                            {user.role}
                          </span>
                          <span className="badge bg-green-100 text-green-700 font-data">
                            {user.trustScore ?? 0}%
                          </span>
                        </div>
                      </div>

                      {/* Menu items */}
                      <NavLink
                        to={profilePath}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-sub hover:bg-bg-muted hover:text-text-main transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">account_circle</span>
                        Account
                      </NavLink>
                      <button
                        onClick={() => { logout(); setProfileOpen(false); navigate('/login'); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-status-danger hover:bg-status-danger/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <Link
                to="/login"
                className="h-9 px-4 flex items-center text-xs font-semibold text-text-muted hover:text-text-main transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}