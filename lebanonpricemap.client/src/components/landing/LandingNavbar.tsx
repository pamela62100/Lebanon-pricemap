import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function LandingNavbar() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-20 flex items-center justify-between px-8 md:px-16 border-b border-border-primary/50 bg-bg-base/80 backdrop-blur-md">
      
      {/* Logo */}
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-10 h-10 bg-text-main flex items-center justify-center shadow-[2px_2px_0px_#0066FF]">
          <span className="text-bg-base text-lg font-bold font-sans tracking-tight">W.A</span>
        </div>
        <span className="font-sans text-xl font-bold text-text-main tracking-tight uppercase">WeinArkhass</span>
      </div>

      {/* Right side: Login / Signup / Profile */}
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <button
              className="btn-consulate"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              className="btn-consulate bg-primary text-white hover:bg-primary-hover"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
          </>
        ) : (
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 border border-border-primary/20 rounded-full hover:bg-bg-surface transition-all"
            >
              <div className="w-5 h-5 flex items-center justify-center text-[9px] font-bold border border-current rounded-full">
                {user.avatarInitials || user.name.charAt(0)}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{user.role}</span>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-bg-surface border border-border-primary shadow-lg rounded-lg overflow-hidden">
              <p className="p-4 font-bold">{user.name}</p>
              <p className="px-4 text-xs text-text-muted mb-2">Role: {user.role}</p>
              <button
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                onClick={() => logout()}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}