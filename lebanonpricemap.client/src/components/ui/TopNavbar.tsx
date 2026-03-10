import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export function TopNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const totalItems = useCartStore((state) => state.totalItemCount());

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const profilePath = user?.role === 'retailer' ? '/retailer/profile' : '/app/profile';

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleToggleProfileMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsProfileMenuOpen((previousState) => !previousState);
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-bg-surface/95 backdrop-blur-lg border-b border-border-soft">
      <nav className="max-w-7xl mx-auto px-4 sm:px-5 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-3 select-none cursor-pointer group"
          onClick={() => navigate(user ? '/app' : '/')}
        >
          <div className="w-10 h-10 bg-text-main rounded-full flex items-center justify-center transition-all group-hover:opacity-90">
            <span className="text-white text-[10px] font-black tracking-tight">WA</span>
          </div>

          <span className="text-xl font-bold text-text-main tracking-tight hidden sm:block">
            WenArkhass
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-1">
                {[
                  { icon: 'storefront', path: '/app/catalog', title: 'Stores' },
                  { icon: 'barcode_scanner', path: '/app/scan', title: 'Scan' },
                  { icon: 'local_gas_station', path: '/app/fuel', title: 'Fuel' },
                  { icon: 'notifications_active', path: '/app/alerts', title: 'Alerts' },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="w-10 h-10 flex items-center justify-center text-text-muted hover:bg-bg-muted hover:text-text-main rounded-full transition-colors"
                    title={item.title}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => navigate('/app/cart')}
                className="relative w-10 h-10 flex items-center justify-center text-text-muted hover:bg-bg-muted hover:text-text-main rounded-full transition-colors"
                title="Cart"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-text-main text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>

              <div className="w-px h-6 bg-border-soft mx-2 hidden sm:block" />

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleToggleProfileMenu}
                  type="button"
                  className={cn(
                    'h-11 pl-1.5 pr-3 flex items-center gap-2 rounded-full border transition-all',
                    isProfileMenuOpen
                      ? 'bg-bg-muted border-border-primary'
                      : 'border-border-primary hover:bg-bg-muted'
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-text-main text-white flex items-center justify-center text-[11px] font-bold">
                    {user.avatarInitials}
                  </div>

                  <span className="hidden lg:block text-sm font-semibold text-text-main">
                    {user.name?.split(' ')[0]}
                  </span>
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 top-full mt-3 w-72 rounded-3xl bg-white border border-border-soft shadow-glass z-[70] overflow-hidden"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="p-5 border-b border-border-soft">
                        <p className="font-bold text-text-main text-2xl leading-none truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-text-muted truncate mt-2">{user.email}</p>

                        <div className="flex items-center gap-2 mt-4 flex-wrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-bg-muted text-text-main capitalize">
                            {user.role}
                          </span>

                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                            {user.trustScore ?? 0}%
                          </span>
                        </div>
                      </div>

                      <div className="p-2">
                        <NavLink
                          to={profilePath}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-base text-text-sub hover:bg-bg-muted hover:text-text-main transition-colors"
                        >
                          <span className="material-symbols-outlined text-[22px]">account_circle</span>
                          Account
                        </NavLink>

                        <button
                          onClick={handleLogout}
                          type="button"
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base text-text-main hover:bg-bg-muted transition-colors"
                        >
                          <span className="material-symbols-outlined text-[22px]">logout</span>
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="h-10 px-4 flex items-center text-sm font-semibold text-text-muted hover:text-text-main transition-colors"
              >
                Sign In
              </Link>

              <Link to="/register" className="btn-primary">
                Join
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}