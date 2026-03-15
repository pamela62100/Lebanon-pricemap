import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export function TopNavbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const totalItems = useCartStore((state) => state.totalItemCount());

  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const profilePath = user?.role === 'retailer' ? '/retailer/profile' : '/app/profile';

  return (
    // No sticky/z-index here — DesktopLayout wrapper handles that
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-border-soft">
      <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => navigate(user ? '/app' : '/')}
          className="flex items-center gap-3 shrink-0"
        >
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-sm font-black">
            WA
          </div>
          <span className="text-2xl font-semibold text-text-main tracking-tight hidden sm:block">
            WenArkhass
          </span>
        </button>

        {user ? (
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="hidden md:flex items-center gap-1">
              {[
                { icon: 'storefront',          path: '/app/catalog',       title: 'Catalog' },
                { icon: 'barcode_scanner',     path: '/app/scan',          title: 'Scanner' },
                { icon: 'local_gas_station',   path: '/app/fuel',          title: 'Fuel' },
                { icon: 'notifications_active',path: '/app/alerts',        title: 'Price alerts' },
                { icon: 'notifications',       path: '/app/notifications', title: 'Notifications' },
              ].map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  title={item.title}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg-muted transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate('/app/cart')}
              title="Cart"
              className="relative w-11 h-11 rounded-full flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg-muted transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <div className="w-px h-8 bg-border-soft mx-1 hidden sm:block" />

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className={cn(
                  'h-12 pl-1.5 pr-4 rounded-full border flex items-center gap-3 transition-all bg-white',
                  profileOpen
                    ? 'border-text-main shadow-sm'
                    : 'border-border-soft hover:bg-bg-muted'
                )}
              >
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                  {user.avatarInitials || user.name?.charAt(0) || 'U'}
                </div>
                <span className="text-lg font-semibold text-text-main hidden sm:block max-w-[180px] truncate">
                  {user.name}
                </span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-72 rounded-[24px] bg-white border border-border-soft shadow-[0_18px_50px_rgba(0,0,0,0.12)] p-3 z-50"
                  >
                    <div className="p-4 border-b border-border-soft">
                      <p className="font-bold text-text-main text-lg truncate">{user.name}</p>
                      <p className="text-sm text-text-muted truncate mt-1">{user.email}</p>
                      <div className="flex items-center gap-2 mt-4 flex-wrap">
                        <span className="px-3 py-1 rounded-full bg-bg-muted text-text-main text-xs font-bold capitalize">
                          {user.role}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                          {user.trustScore ?? 0}% trust
                        </span>
                      </div>
                    </div>

                    <NavLink
                      to={profilePath}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-base text-text-main hover:bg-bg-muted transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">account_circle</span>
                      Account
                    </NavLink>

                    <button
                      type="button"
                      onClick={() => { logout(); setProfileOpen(false); navigate('/login'); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base text-red-600 hover:bg-red-50 transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="h-11 px-4 flex items-center text-sm font-semibold text-text-muted hover:text-text-main transition-colors"
            >
              Sign in
            </Link>
            <Link to="/register" className="btn-primary">
              Join
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}