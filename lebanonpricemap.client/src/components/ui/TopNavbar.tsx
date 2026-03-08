import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useCartStore } from '@/store/useCartStore';
import { useApprovalStore } from '@/store/useApprovalStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { GlobalEssentialsTicker } from './GlobalEssentialsTicker';

export function TopNavbar() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const { isDark, toggle } = useThemeStore();
  const totalItems = useCartStore(s => s.totalItemCount());
  const myRequestsCount = useApprovalStore(
    s => s.requests.filter(r => r.requestedBy === user?.id && r.status === 'pending').length
  );
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const profilePath = user?.role === 'retailer' ? '/retailer/profile' : '/app/profile';

  return (
    <div className="sticky top-0 z-50 w-full font-sans">
      <GlobalEssentialsTicker />

      <nav className="bg-bg-surface/90 backdrop-blur-xl border-b border-border-primary w-full px-6 md:px-12 h-20 flex items-center justify-between transition-all">
        
        {/* Logo */}
        <div
          className="flex items-center gap-3 select-none cursor-pointer group"
          onClick={() => navigate('/app')}
        >
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm group-hover:opacity-90 transition-all">
            <span className="text-white text-sm font-sans font-black tracking-tight">W.A</span>
          </div>
          <span className="font-sans font-black text-lg text-text-main tracking-tight">
            WeinArkhas
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 p-1.5 bg-bg-muted border border-border-primary/10 rounded-full">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-primary rounded-full hover:bg-bg-surface transition-all"
          >
            <span className="material-symbols-outlined text-lg">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>

          <div className="w-px h-6 bg-border-primary/10 mx-1" />

          {/* Action buttons */}
          {[
            { icon: 'barcode_scanner', path: '/app/scan', title: 'Scan' },
            { icon: 'local_gas_station', path: '/app/fuel', title: 'Fuel' },
            { icon: 'notifications_active', path: '/app/alerts', title: 'Alerts' },
            { icon: 'inbox', path: '/app/notifications', title: 'Inbox' },
          ].map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-primary rounded-full hover:bg-bg-surface transition-all"
              title={item.title}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
            </button>
          ))}

          {/* Requests badge */}
          {user?.role === 'shopper' && (
            <button
              onClick={() => navigate('/app/requests')}
              className="relative w-10 h-10 flex items-center justify-center text-text-muted hover:text-primary rounded-full hover:bg-bg-surface transition-all"
              title="Requests"
            >
              <span className="material-symbols-outlined text-lg">approval</span>
              {myRequestsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary text-white text-[8px] font-bold flex items-center justify-center rounded-full">
                  {myRequestsCount}
                </span>
              )}
            </button>
          )}

          {/* Cart */}
          <button
            onClick={() => navigate('/app/cart')}
            className="relative w-10 h-10 flex items-center justify-center text-text-muted hover:text-primary rounded-full hover:bg-bg-surface transition-all"
            title="Cart"
          >
            <span className="material-symbols-outlined text-lg">shopping_cart</span>
            {totalItems > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-text-main text-bg-base text-[8px] font-bold flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>

          <div className="w-px h-6 bg-border-primary/10 mx-1" />

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={cn(
                'h-10 px-4 flex items-center gap-2 border border-border-primary/20 rounded-full hover:border-primary/40 transition-all',
                profileOpen && 'bg-primary text-white border-primary'
              )}
            >
              <div className="w-5 h-5 flex items-center justify-center text-[9px] font-bold border border-current rounded-full">
                {user?.avatarInitials}
              </div>
              <span className="hidden lg:block text-xs font-bold capitalize">
                {user?.role}
              </span>
              <span className="material-symbols-outlined text-sm">
                {profileOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </span>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-60 bg-bg-surface border border-border-primary rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-5 border-b border-border-soft bg-bg-muted/50">
                    <p className="font-sans text-base font-black text-text-main truncate mb-1">
                      {user?.name}
                    </p>
                    <p className="text-xs text-primary font-bold capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <div className="p-2 bg-bg-surface">
                    <NavLink
                      to={profilePath}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-text-sub rounded-lg hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      <span className="material-symbols-outlined text-text-muted text-lg">account_circle</span>
                      My Profile
                    </NavLink>
                    <button
                      onClick={() => { logout(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 rounded-lg hover:bg-red-50 transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      Log Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </div>
  );
}