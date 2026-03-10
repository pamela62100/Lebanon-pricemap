import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';

const ROLE_DESTINATIONS: Record<string, string> = {
  shopper: '/app',
  retailer: '/retailer',
  admin: '/admin',
};

const TRUST_BULLETS = [
  {
    icon: 'verified',
    label: 'Verified prices',
    desc: 'Official store prices and trusted community updates.',
  },
  {
    icon: 'security',
    label: 'More reliable reports',
    desc: 'Trust scores help surface better price information.',
  },
  {
    icon: 'groups',
    label: 'Built for Lebanon',
    desc: 'Compare prices, track stock, and shop with more confidence.',
  },
];

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 600));
    const result = login(email, password);

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Sign in failed. Please try again.');
      return;
    }

    const role =
      email.includes('@admin') || email.includes('admin@')
        ? 'admin'
        : email.includes('retailer') || email.includes('@store')
        ? 'retailer'
        : 'shopper';

    navigate(ROLE_DESTINATIONS[role] ?? '/app');
  };

  return (
    <div className="min-h-screen bg-bg-base flex">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-[48%] bg-bg-base border-r border-border-primary p-16 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-black">WA</span>
          </div>
          <span
            className="font-display text-xl text-text-main tracking-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            WenArkhass
          </span>
        </div>

        <div className="relative z-10 space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-primary" />
              <p className="text-overline tracking-[0.4em]">Welcome back</p>
            </div>

            <h1
              className="text-5xl font-display text-text-main leading-[1.1] mb-6"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Sign in to
              <br />
              <span className="italic">WenArkhass.</span>
            </h1>

            <p className="text-lg text-text-sub font-medium leading-relaxed max-w-sm">
              Check prices, compare stores, and stay updated before you leave home.
            </p>
          </div>

          <div className="space-y-6">
            {TRUST_BULLETS.map((bullet, index) => (
              <motion.div
                key={bullet.icon}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.12 }}
                className="flex items-start gap-5 p-4 bg-white/50 border border-border-soft rounded-2xl"
              >
                <div className="w-12 h-12 rounded-xl bg-bg-base border border-border-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    {bullet.icon}
                  </span>
                </div>
                <div>
                  <p
                    className="font-display text-base font-bold text-text-main"
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                  >
                    {bullet.label}
                  </p>
                  <p className="text-text-muted text-xs mt-0.5 leading-relaxed">
                    {bullet.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-text-muted text-[10px] font-bold uppercase tracking-widest">
          © 2025 WenArkhass. Built for Lebanon.
        </p>
      </motion.div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white text-[10px] font-black">WA</span>
            </div>
            <span
              className="font-display text-lg text-text-main tracking-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              WenArkhass
            </span>
          </div>

          <div className="mb-10">
            <h2
              className="text-4xl font-display text-text-main leading-none mb-3"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Sign in
            </h2>
            <p className="text-text-sub font-medium">
              Access your account to track prices, alerts, and store updates.
            </p>
          </div>

          <div className="mb-8 p-4 rounded-xl bg-bg-muted border border-border-primary text-sm text-text-sub leading-relaxed">
            <span className="font-black text-primary mr-2">Demo accounts:</span>
            Use <code className="text-primary">retailer@test.com</code> or{' '}
            <code className="text-primary">admin@test.com</code> for testing.
          </div>

          {error ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-400/30 flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-red-500 text-[18px]">error</span>
              <p className="text-red-500 text-sm font-medium">{error}</p>
            </motion.div>
          ) : null}

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted">Email address</label>
              <div className="group relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px] group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full h-12 pl-12 pr-4 bg-bg-surface border border-border-primary rounded-md text-sm font-medium text-text-main placeholder:text-text-muted/40 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-text-muted">Password</label>
                <button type="button" className="text-[11px] font-bold text-primary hover:underline">
                  Forgot password?
                </button>
              </div>

              <div className="group relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px] group-focus-within:text-primary transition-colors">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full h-12 pl-12 pr-12 bg-bg-surface border border-border-primary rounded-md text-sm font-medium text-text-main placeholder:text-text-muted/40 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="btn-primary w-full h-12 mt-4 shadow-glass"
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="material-symbols-outlined text-[18px]"
                  >
                    progress_activity
                  </motion.span>
                  Signing in...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  Sign in
                </>
              )}
            </button>
          </div>

          <p className="text-center text-sm font-medium text-text-muted mt-10 leading-relaxed">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="text-primary hover:text-primary-hover transition-colors underline underline-offset-4 decoration-primary/30"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}