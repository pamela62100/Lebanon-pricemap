import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

const ROLE_DESTINATIONS: Record<string, string> = {
  shopper:  '/app',
  retailer: '/retailer',
};

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) ? 2
    : 3;
  const labels = ['', 'Weak', 'Fair', 'Strong'];
  const colors = ['', 'bg-status-flagged', 'bg-status-pending', 'bg-status-verified'];
  const textColors = ['', 'text-status-flagged', 'text-status-pending', 'text-status-verified'];

  if (!password) return null;

  return (
    <div className="flex items-center gap-3 px-1">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={cn('h-1 flex-1 rounded-full transition-all', i <= strength ? colors[strength] : 'bg-border-soft')}
          />
        ))}
      </div>
      <span className={cn('text-[9px] font-data font-black uppercase tracking-widest', textColors[strength])}>{labels[strength]}</span>
    </div>
  );
}

const ROLE_CARDS = [
  {
    id: 'shopper' as const,
    icon: 'shopping_cart',
    title: 'Shopper',
    subtitle: 'I want to save money',
    bullets: ['Browse verified prices', 'Report discrepancies', 'Get price alerts'],
    gradient: 'from-primary/5 to-primary/10',
    border: 'border-primary/30',
  },
  {
    id: 'retailer' as const,
    icon: 'storefront',
    title: 'Retailer',
    subtitle: 'I manage a store',
    bullets: ['Publish official catalog', 'Manage promotions', 'Build community trust'],
    gradient: 'from-indigo-500/5 to-purple-500/10',
    border: 'border-indigo-400/30',
  },
];

export function RegisterPage() {
  const [role, setRole]           = useState<'shopper' | 'retailer'>('shopper');
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const register = useAuthStore(s => s.register);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !password || !confirm) {
      setError('All fields are required.'); return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.'); return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = register(email, password, role, name);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? 'Registration failed.'); return;
    }
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
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-black">W.A</span>
          </div>
          <span className="font-display text-xl text-text-main tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
            WeinArkhas
          </span>
        </div>

        <div className="relative z-10 space-y-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-primary" />
              <p className="text-overline tracking-[0.4em]">Collective_Intelligence</p>
            </div>
            <h1 className="text-5xl font-display text-text-main leading-[1.1] mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Join Lebanon's<br />
              <span className="italic text-primary">Price Movement.</span>
            </h1>
            <p className="text-lg text-text-sub font-medium leading-relaxed max-w-sm">
              Over 12,000 shoppers and 800+ stores already trust WeinArkhas for transparent data.
            </p>
          </div>
          
          <div className="flex items-center gap-10">
            {[
              { val: '12K+', label: 'Shoppers' },
              { val: '800+', label: 'Stores' },
              { val: '45K+', label: 'Prices' }
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-data font-black text-text-main">{stat.val}</p>
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-text-muted text-[10px] font-bold uppercase tracking-widest">
          © 2025 WeinArkhas_Protocol. Built for Lebanon.
        </p>
      </motion.div>

      {/* ── Right form panel ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
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
            <h2 className="text-4xl font-display text-text-main leading-none mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>Join the network.</h2>
            <p className="text-text-sub font-medium">Free forever. Decentralized intelligence for Lebanese shoppers.</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {ROLE_CARDS.map(card => (
              <button
                key={card.id}
                onClick={() => setRole(card.id)}
                className={cn(
                  'p-5 rounded-lg border text-left transition-all relative overflow-hidden group',
                  role === card.id
                    ? 'border-primary bg-white shadow-soft ring-1 ring-primary/20'
                    : 'border-border-primary bg-bg-surface hover:border-primary/30'
                )}
              >
                <span className={cn('material-symbols-outlined text-[24px] block mb-3', role === card.id ? 'text-primary' : 'text-text-muted')}>
                  {card.icon}
                </span>
                <p className="font-display text-lg font-bold text-text-main leading-none" style={{ fontFamily: "'DM Serif Display', serif" }}>{card.title}</p>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1.5">{card.subtitle}</p>
                
                {role === card.id && (
                  <motion.div layoutId="role-indicator" className="absolute top-3 right-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  </motion.div>
                )}
              </button>
            ))}
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
            {/* Full name */}
            <div className="space-y-2">
              <p className="text-overline tracking-[0.2em] text-[9px]">Identity_Label</p>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px] group-focus-within:text-primary transition-colors">person</span>
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-bg-surface border border-border-primary rounded-md text-sm font-medium text-text-main placeholder:text-text-muted/40 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <p className="text-overline tracking-[0.2em] text-[9px]">Endpoint_Address</p>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px] group-focus-within:text-primary transition-colors">mail</span>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-bg-surface border border-border-primary rounded-md text-sm font-medium text-text-main placeholder:text-text-muted/40 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <p className="text-overline tracking-[0.2em] text-[9px]">Access_Key</p>
              <div className="space-y-3">
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px] group-focus-within:text-primary transition-colors">lock</span>
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full h-12 pl-12 pr-12 bg-bg-surface border border-border-primary rounded-md text-sm font-medium text-text-main placeholder:text-text-muted/40 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">{showPw ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                <PasswordStrengthBar password={password} />
              </div>
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <p className="text-overline tracking-[0.2em] text-[9px]">Validation_Check</p>
              <div className="relative group">
                <span className={cn(
                  'material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] transition-colors group-focus-within:text-primary',
                  confirm && confirm !== password ? 'text-red-400' : 'text-text-muted'
                )}>
                  {confirm && confirm !== password ? 'lock_open' : 'lock_person'}
                </span>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Repeat Access_Key"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className={cn(
                    'w-full h-12 pl-12 pr-4 bg-bg-surface border rounded-md text-sm font-medium text-text-main placeholder:text-text-muted/40 outline-none focus:ring-4 transition-all',
                    confirm && confirm !== password ? 'border-red-400 focus:ring-red-400/5' : 'border-border-primary focus:border-primary/50 focus:ring-primary/5'
                  )}
                />
              </div>
            </div>

            {/* Privacy note */}
            <div className="py-4 border-y border-border-soft">
              <p className="text-[9px] text-text-muted font-bold uppercase tracking-[0.2em] text-center leading-relaxed">
                <span className="material-symbols-outlined text-[14px] align-middle mr-2 text-status-verified">shield</span>
                Data Integrity Protected. Protocol enforced.
              </p>
            </div>

            {/* Submit */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="btn-primary w-full h-12 mt-4 shadow-glass"
            >
              {loading ? (
                <>
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="material-symbols-outlined text-[18px]">
                    progress_activity
                  </motion.span>
                  Processing_Identity...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  Initialize Account
                </>
              )}
            </button>
          </div>

          <p className="text-center text-[11px] font-bold text-text-muted mt-10 uppercase tracking-widest leading-relaxed">
            Existing Identity?{' '}
            <Link to="/login" className="text-primary hover:text-primary-hover transition-colors ml-2 underline underline-offset-4 decoration-primary/30">Sign_In →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
