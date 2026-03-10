import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function LandingNavbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-20 flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 border-b border-border-primary/40 bg-white/85 backdrop-blur-md shadow-soft">
      <div
        className="flex items-center gap-3 select-none cursor-pointer group"
        onClick={() => navigate('/')}
      >
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm group-hover:opacity-90 transition-all">
          <span className="text-white text-[10px] font-black tracking-tight">WA</span>
        </div>

        <span
          className="font-display text-lg text-text-main tracking-tight"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          WenArkhass
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {!user ? (
          <>
            <button
              className="hidden sm:inline-flex text-sm font-bold text-text-sub hover:text-primary transition-colors"
              onClick={() => navigate('/login')}
            >
              Sign in
            </button>

            <button className="btn-primary" onClick={() => navigate('/register')}>
              Get Started
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/app')}
            className="flex items-center gap-3 px-4 py-2 border border-border-primary rounded-full hover:border-primary hover:bg-bg-base transition-all"
          >
            <div className="w-7 h-7 flex items-center justify-center text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 rounded-full">
              {user.avatarInitials || user.name.charAt(0)}
            </div>
            <span className="hidden sm:inline text-sm font-bold text-text-main">
              Open App
            </span>
          </button>
        )}
      </div>
    </header>
  );
}