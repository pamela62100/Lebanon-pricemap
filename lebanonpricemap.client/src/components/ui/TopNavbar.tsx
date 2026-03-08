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
  const myRequestsCount = useApprovalStore(s => s.requests.filter(r => r.requestedBy === user?.id && r.status === 'pending').length);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const profilePath = user?.role === 'retailer' ? '/retailer/profile' : '/app/profile';

  return (
    <div className="sticky top-0 z-50 w-full">
      <GlobalEssentialsTicker />
      <nav className="bg-bg-surface/90 backdrop-blur-xl border-b border-border-primary w-full px-8 md:px-12 h-20 flex items-center justify-between transition-all">
        {/* Logo - Archival Monogram */}
        <div className="flex items-center gap-4 select-none cursor-pointer group" onClick={() => navigate('/app')}>
          <div className="w-11 h-11 bg-primary border border-primary flex items-center justify-center transition-all group-hover:brightness-125 shadow-sm">
            <span className="text-white text-xl font-serif font-black tracking-tighter italic">WW</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black text-2xl tracking-[0.1em] text-text-main leading-none uppercase">
              Wein Wrkhas
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-[1px] w-4 bg-primary" />
              <span className="text-text-muted text-[9px] tracking-[0.4em] font-bold uppercase">Archival Edition</span>
            </div>
          </div>
        </div>

        {/* Right Actions - Clean Gallery Grid */}
        <div className="flex items-center gap-2 p-1.5 bg-bg-muted border border-border-primary/10 rounded-full">
          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-primary transition-all rounded-full hover:bg-bg-surface"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <div className="w-px h-6 bg-border-primary/10 mx-1" />

          {/* Action Grid */}
          {[
            { icon: 'barcode_scanner', path: '/app/scan', title: 'Scan' },
            { icon: 'local_gas_station', path: '/app/fuel', title: 'Fuel' },
            { icon: 'notifications_active', path: '/app/alerts', title: 'Alerts' },
            { icon: 'inbox', path: '/app/notifications', title: 'Inbox' },
          ].map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-primary transition-all rounded-full hover:bg-bg-surface"
              title={item.title}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{item.icon}</span>
            </button>
          ))}

          {/* My Requests */}
          {user?.role === 'shopper' && (
            <button
              onClick={() => navigate('/app/requests')}
              className="relative w-10 h-10 flex items-center justify-center text-text-muted hover:text-primary transition-all rounded-full hover:bg-bg-surface"
              title="Requests"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>approval</span>
              {myRequestsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[8px] font-bold flex items-center justify-center rounded-full">
                  {myRequestsCount}
                </span>
              )}
            </button>
          )}

          {/* Cart with badge */}
          <button
            onClick={() => navigate('/app/cart')}
            className="relative w-10 h-10 flex items-center justify-center text-text-muted hover:text-primary transition-all rounded-full hover:bg-bg-surface"
            title="Cart"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shopping_cart</span>
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-text-main text-bg-base text-[8px] font-bold flex items-center justify-center rounded-full">
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
                "h-10 px-4 flex items-center gap-2 transition-all border border-border-primary/20 hover:border-primary/40 rounded-full",
                profileOpen && "bg-primary text-white border-primary"
              )}
            >
              <div className="w-5 h-5 flex items-center justify-center text-[9px] font-bold border border-current rounded-full">
                {user?.avatarInitials}
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] hidden lg:block">{user?.role}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                {profileOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </span>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-64 bg-bg-surface border border-border-primary shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-6 border-b border-border-soft bg-bg-muted/50">
                    <p className="font-serif text-xl font-black text-text-main italic truncate leading-none mb-1">{user?.name}</p>
                    <p className="text-[9px] text-primary uppercase font-bold tracking-[0.3em]">Verified {user?.role}</p>
                  </div>
                  <div className="p-2 bg-bg-surface">
                    <NavLink 
                      to={profilePath} 
                      onClick={() => setProfileOpen(false)} 
                      className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-text-sub hover:bg-primary/5 hover:text-primary transition-all uppercase tracking-widest rounded-sm"
                    >
                      <span className="material-symbols-outlined text-text-muted group-hover:text-primary" style={{ fontSize: '18px' }}>account_circle</span>
                      Identity Archive
                    </NavLink>
                    <button 
                      onClick={() => { logout(); setProfileOpen(false); }} 
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-red-600 hover:bg-red-50 transition-all uppercase tracking-widest rounded-sm"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
                      Terminate Session
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
