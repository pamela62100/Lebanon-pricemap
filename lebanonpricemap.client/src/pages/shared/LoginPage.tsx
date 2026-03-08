import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleLogin = () => {
  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }

  const userRole = email.includes('retailer') ? 'retailer' : 'shopper';
  login(userRole);

  if (userRole === 'retailer') navigate('/retailer');
  else navigate('/app');
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-bg-base">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-black text-text-main">Login</h2>
          <p className="text-sm text-text-muted mt-2">Track prices and save your budget</p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl border border-border-soft focus:ring-2 ring-primary outline-none transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl border border-border-soft focus:ring-2 ring-primary outline-none transition-all"
          />

          <div className="flex justify-between items-center px-2">
            <label className="flex items-center gap-2 text-xs text-text-sub">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="accent-primary"
              />{' '}
              Remember me
            </label>
            <button
              type="button"
              className="text-xs text-primary font-bold"
              onClick={() => alert('Password reset flow')}
            >
              Forgot password?
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
        >
          Login
        </button>
       

        <p className="text-center text-sm text-text-muted">
          Don’t have an account?{' '}
          <span
            className="text-primary font-bold cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Sign up now
          </span>
        </p>
      </div>
    </div>
  );
}