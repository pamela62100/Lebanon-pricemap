import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

const ROLE_DESTINATIONS: Record<string, string> = {
  shopper:  '/app',
  retailer: '/retailer',
  admin:    '/admin',
};

const TRUST_BULLETS = [
  { icon: 'verified', label: 'Verified Catalog Prices', desc: 'Official prices from store owners, not rumors.' },
  { icon: 'security', label: 'Anti-Fraud Protection', desc: 'Trust scores filter bad reports automatically.' },
  { icon: 'groups', label: 'Community-Powered', desc: 'Thousands of Lebanese shoppers reporting live.' },
];

export function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const login    = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Login failed. Please try again.');
      return;
    }
    // Determine destination from role (detectRole already ran inside login)
    const role = email.includes('@admin') || email.includes('admin@')
      ? 'admin' : email.includes('retailer') || email.includes('@store')
      ? 'retailer' : 'shopper';
    navigate(ROLE_DESTINATIONS[role] ?? '/app');
  };

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* ── Left branding panel ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-[48%] bg-bg-base border-r border-border-primary p-16 relative overflow-hidden"
      >
        {/* Subtle background texture/grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-black">W.A</span>
          </div>
          <span className="font-display text-xl text-text-main tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
            WeinArkhas
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-primary" />
              <p className="text-overline tracking-[0.4em]">Economic_Sovereignty</p>
            </div>
            <h1 className="text-5xl font-display text-text-main leading-[1.1] mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
              The Live Price<br />
              <span className="italic">Map of Lebanon.</span>
            </h1>
            <p className="text-lg text-text-sub font-medium leading-relaxed max-w-sm">
              Real pricing data from verified retailers and the community — updated live.
            </p>
          </div>

          <div className="space-y-6">
            {TRUST_BULLETS.map((b, i) => (
              <motion.div
                key={b.icon}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.12 }}
                className="flex items-start gap-5 p-4 bg-white/50 border border-border-soft rounded-2xl"
              >
                <div className="w-12 h-12 rounded-xl bg-bg-base border border-border-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[24px]">{b.icon}</span>
                </div>
                <div>
                  <p className="font-display text-base font-bold text-text-main" style={{ fontFamily: "'DM Serif Display', serif" }}>{b.label}</p>
                  <p className="text-text-muted text-xs mt-0.5 leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom credits */}
        <p className="relative z-10 text-text-muted text-[10px] font-bold uppercase tracking-widest">
          © 2025 WeinArkhas_Protocol. Built for Lebanon.
        </p>
      </motion.div>

      {/* ── Right form panel ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white text-[10px] font-black font-data">W.A</span>
            </div>
            <span className="font-display text-lg text-text-main tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>WeinArkhas</span>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-display text-text-main leading-none mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>Welcome back.</h2>
            <p className="text-text-sub font-medium">Protocol authentication required to access private catalog data.</p>
          </div>

          {/* Hint */}
          <div className="mb-8 p-4 rounded-xl bg-bg-muted border border-border-primary text-[10px] font-data text-text-sub leading-relaxed">
            <span className="font-black text-primary uppercase tracking-widest mr-2">Credentials:</span>
            Use <code className="text-primary">retailer@test.com</code> or <code className="text-primary">admin@test.com</code> for development testing.
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-400/30 flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-red-500 text-[18px]">error</span>
              <p className="text-red-500 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <p className="text-overline tracking-[0.2em] text-[9px]">Endpoint_Address</p>
              <div className="group relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px] group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="w-full h-12 pl-12 pr-4 bg-bg-surface border border-border-primary rounded-md text-sm font-medium text-text-main placeholder:text-text-muted/40 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-overline tracking-[0.2em] text-[9px]">Access_Key</p>
                <button type="button" className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline">
                  Forgot_Key
                </button>
              </div>
              <div className="group relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px] group-focus-within:text-primary transition-colors">
                  lock
                </span>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="w-full h-12 pl-12 pr-12 bg-bg-surface border border-border-primary rounded-md text-sm font-medium text-text-main placeholder:text-text-muted/40 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">{showPw ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Submit */}
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
                  Authenticating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  Execute Login
                </>
              )}
            </button>
          </div>

          <p className="text-center text-[11px] font-bold text-text-muted mt-10 uppercase tracking-widest leading-relaxed">
            New to the Protocol?{' '}
            <Link to="/register" className="text-primary hover:text-primary-hover transition-colors ml-2 underline underline-offset-4 decoration-primary/30">
              Create_Network_Identity
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}