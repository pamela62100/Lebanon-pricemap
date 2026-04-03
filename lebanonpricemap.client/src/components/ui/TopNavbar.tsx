import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useExchangeRateStore } from '@/store/useExchangeRateStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const NAV_ITEMS = [
  { icon: 'search',               path: '/app',         title: 'Search', end: true,  mobileOnly: false },
  { icon: 'storefront',           path: '/app/catalog', title: 'Stores', end: false, mobileOnly: false },
  { icon: 'barcode_scanner',      path: '/app/scan',    title: 'Scan',   end: false, mobileOnly: true  },
  { icon: 'local_gas_station',    path: '/app/fuel',    title: 'Fuel',   end: false, mobileOnly: false },
  { icon: 'notifications_active', path: '/app/alerts',  title: 'Alerts', end: false, mobileOnly: false },
];

export function TopNavbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const totalItems = useCartStore((state) => state.totalItemCount());
  const { rateLbpPerUsd, isLoading: rateLoading, fetchRate } = useExchangeRateStore();

  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchRate(); }, [fetchRate]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const profilePath = user?.role === 'retailer' ? '/retailer/profile' : '/app/profile';

  return (
    <div className="w-full bg-white border-b border-border-soft">
      {/* Full-width, no max-w constraint, edge-to-edge padding */}
      <nav className="w-full px-4 lg:px-6 h-14 flex items-center gap-2">

        {/* Logo — stays flush left */}
        <button
          type="button"
          onClick={() => navigate(user ? '/app' : '/')}
          className="flex items-center gap-2 shrink-0 mr-3"
        >
          <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-[11px] font-black">
            WA
          </div>
          <span className="text-sm font-bold text-text-main hidden sm:block">WenArkhass</span>
        </button>

        {user ? (
          <>
            {/* Nav links right next to logo */}
            <div className="hidden md:flex items-center gap-0.5">
              {NAV_ITEMS.filter(item => !item.mobileOnly).map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) => cn(
                    'flex items-center gap-1.5 px-3 h-8 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                    isActive
                      ? 'bg-bg-muted text-text-main'
                      : 'text-text-muted hover:text-text-main hover:bg-bg-muted/60'
                  )}
                >
                  <span className="material-symbols-outlined text-[17px]">{item.icon}</span>
                  {item.title}
                </NavLink>
              ))}
            </div>

            {/* Spacer pushes right-side items to the edge */}
            <div className="flex-1" />

            {/* Right side */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Exchange rate */}
              <button
                type="button"
                onClick={fetchRate}
                disabled={rateLoading}
                className="hidden lg:flex items-center gap-1 px-3 h-8 rounded-lg bg-bg-muted border border-border-soft text-xs font-medium text-text-muted hover:text-text-main transition-all"
              >
                <span>1 USD =</span>
                <span className="font-bold text-text-main">
                  {rateLoading ? '...' : `${rateLbpPerUsd.toLocaleString()} LBP`}
                </span>
              </button>

              {/* My List */}
              <button
                type="button"
                onClick={() => navigate('/app/list')}
                className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-muted/60 transition-all"
              >
                <span className="material-symbols-outlined text-[17px]">checklist</span>
                <span className="hidden sm:block">My List</span>
                {totalItems > 0 && (
                  <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <div className="w-px h-5 bg-border-soft" />

              {/* Profile */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  className={cn(
                    'flex items-center gap-2 pl-1 pr-2.5 h-8 rounded-lg border transition-all',
                    profileOpen ? 'border-text-main/30 bg-bg-muted' : 'border-border-soft hover:bg-bg-muted'
                  )}
                >
                  <div className="w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                    {user.avatarInitials || user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-text-main hidden sm:block max-w-[110px] truncate">
                    {user.name}
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-text-muted hidden sm:block">
                    expand_more
                  </span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-border-soft shadow-lg p-2 z-50"
                    >
                      <div className="px-3 py-2.5 border-b border-border-soft mb-1">
                        <p className="font-semibold text-text-main text-sm truncate">{user.name}</p>
                        <p className="text-xs text-text-muted truncate mt-0.5">{user.email}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="px-2 py-0.5 rounded-full bg-bg-muted text-text-main text-xs font-medium capitalize">
                            {user.role}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                            {user.trustScore ?? 0}% trust
                          </span>
                        </div>
                      </div>
                      <NavLink
                        to={profilePath}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-text-main hover:bg-bg-muted transition-all"
                      >
                        <span className="material-symbols-outlined text-[17px] text-text-muted">account_circle</span>
                        Account
                      </NavLink>
                      <button
                        type="button"
                        onClick={() => { logout(); setProfileOpen(false); navigate('/login'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-all"
                      >
                        <span className="material-symbols-outlined text-[17px]">logout</span>
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Link to="/login" className="h-8 px-3 flex items-center text-sm font-medium text-text-muted hover:text-text-main transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary h-8 px-4 text-sm">
                Get started
              </Link>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}
