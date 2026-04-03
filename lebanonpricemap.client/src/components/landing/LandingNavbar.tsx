import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function LandingNavbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-16 flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 border-b border-border-primary/40 bg-white/90 backdrop-blur-md">
      <div
        className="flex items-center gap-2.5 select-none cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white text-[10px] font-black">WA</span>
        </div>
        <span className="font-bold text-base text-text-main">WenArkhass</span>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">Features</a>
        <a href="#how-it-works" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">How it works</a>
      </nav>

      <div className="flex items-center gap-3">
        {!user ? (
          <>
            <button
              className="hidden sm:inline-flex text-sm font-medium text-text-muted hover:text-text-main transition-colors"
              onClick={() => navigate('/login')}
            >
              Sign in
            </button>
            <button
              className="h-9 px-5 bg-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all"
              onClick={() => navigate('/register')}
            >
              Get Started
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/app')}
            className="h-9 px-5 bg-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            Open App
          </button>
        )}
      </div>
    </header>
  );
}
