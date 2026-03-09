import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function LandingNavbar() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-20 flex items-center justify-between px-8 md:px-16 border-b border-border-primary/50 bg-white/80 backdrop-blur-md shadow-soft">
      
      {/* Logo */}
      <div className="flex items-center gap-3 select-none cursor-pointer group" onClick={() => navigate('/')}>
        <div className="w-9 h-9 bg-primary rounded-md flex items-center justify-center shadow-sm group-hover:opacity-90 transition-all">
          <span className="text-white text-[10px] font-black font-data tracking-tight">W.A</span>
        </div>
        <span className="font-display text-lg text-text-main tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
          WeinArkhas
        </span>
      </div>

      {/* Right side: Login / Signup / Profile */}
      <div className="flex items-center gap-6">
        {!user ? (
          <>
            <button
              className="text-[11px] font-bold uppercase tracking-widest text-text-sub hover:text-primary transition-colors"
              onClick={() => navigate('/login')}
            >
              Sign_In
            </button>
            <button
              className="btn-primary"
              onClick={() => navigate('/register')}
            >
              Get Started
            </button>
          </>
        ) : (
          <div className="relative group">
            <button
              onClick={() => navigate('/app')}
              className="flex items-center gap-3 px-4 py-2 border border-border-primary rounded-full hover:border-primary hover:bg-bg-base transition-all"
            >
              <div className="w-5 h-5 flex items-center justify-center text-[9px] font-bold bg-primary/10 text-primary border border-primary/20 rounded-full">
                {user.avatarInitials || user.name.charAt(0)}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-main">Go_to_Market</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}