import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const shopperTabs = [
  { path: '/app',              icon: 'search',         label: 'Browse Items' },
  { path: '/app/upload',       icon: 'add_a_photo',    label: 'Upload Receipt' },
  { path: '/app/notifications',icon: 'notifications',  label: 'Alerts' },
];

const retailerTabs = [
  { path: '/app/retailer',            icon: 'storefront',    label: 'Store Dashboard' },
  { path: '/app/retailer/insights',   icon: 'insights',      label: 'Market Insights' },
  { path: '/app/retailer/promotions', icon: 'local_offer',   label: 'Promotions' },
];

export function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const { isDark, toggle } = useThemeStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabs = user?.role === 'retailer' ? retailerTabs : shopperTabs;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const profilePath = user?.role === 'retailer' ? '/app/retailer/profile' : '/app/profile';

  return (
    <nav className="sticky top-0 z-50 bg-bg-surface/80 backdrop-blur-lg border-b border-border-primary w-full shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 select-none shrink-0" onClick={() => navigate('/app')} style={{cursor: 'pointer'}}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-lg">🔥</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-text-main">
            Wein <span className="text-primary">Arkhas</span>
          </span>
        </div>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = tab.path === '/app' || tab.path === '/app/retailer'
              ? location.pathname === tab.path
              : location.pathname.startsWith(tab.path);
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={cn(
                  'relative px-4 py-2 rounded-lg text-sm font-medium transition-all group flex items-center gap-2',
                  isActive ? 'text-text-main' : 'text-text-muted hover:text-text-main hover:bg-bg-muted/50'
                )}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {tab.icon}
                </span>
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="top-nav-active"
                    className="absolute inset-x-0 -bottom-[19px] h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg-muted transition-colors"
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 pl-3 pr-1 rounded-full border border-border-primary hover:border-primary transition-colors bg-bg-surface"
            >
              <span className="text-sm font-semibold text-text-main max-w-[100px] truncate">{user?.name}</span>
              <div className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center text-xs font-bold shrink-0">
                {user?.avatarInitials}
              </div>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-bg-surface border border-border-primary rounded-xl shadow-glass overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-border-soft bg-bg-muted/50">
                    <p className="font-bold text-text-main truncate">{user?.name}</p>
                    <p className="text-xs text-text-muted mt-0.5 truncate">{user?.email}</p>
                    <div className="flex items-center gap-1 mt-2 bg-primary-soft text-primary text-xs font-bold px-2 py-1 rounded w-fit">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>star</span>
                      {user?.trustScore} Trust Score
                    </div>
                  </div>
                  
                  <div className="p-2 flex flex-col gap-1">
                    <NavLink
                      to={profilePath}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-sub hover:bg-bg-muted hover:text-text-main transition-colors"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
                      My Profile
                    </NavLink>
                    <button
                      onClick={() => { setProfileOpen(false); logout(); }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[var(--status-flagged-text)] hover:bg-[var(--status-flagged-bg)] transition-colors w-full text-left"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
