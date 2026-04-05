import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

const ROLE_DESTINATIONS: Record<string, string> = {
  shopper: '/app',
  retailer: '/retailer',
};

function PasswordStrengthBar({ password }: { password: string }) {
  const strength =
    password.length === 0
      ? 0
      : password.length < 6
      ? 1
      : password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)
      ? 2
      : 3;

  const labels = ['', 'Weak', 'Fair', 'Strong'];
  const colors = ['', 'bg-status-flagged', 'bg-status-pending', 'bg-status-verified'];
  const textColors = ['', 'text-status-flagged', 'text-status-pending', 'text-status-verified'];

  if (!password) return null;

  return (
    <div className="flex items-center gap-3 px-1">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={cn(
              'h-1 flex-1 rounded-full transition-all',
              level <= strength ? colors[strength] : 'bg-border-soft'
            )}
          />
        ))}
      </div>
      <span className={cn('text-[10px] font-bold tracking-widest uppercase', textColors[strength])}>
        {labels[strength]}
      </span>
    </div>
  );
}

const ROLE_CARDS = [
  {
    id: 'shopper' as const,
    icon: 'shopping_cart',
    title: 'Shopper',
    subtitle: 'I want to compare prices',
  },
  {
    id: 'retailer' as const,
    icon: 'storefront',
    title: 'Retailer',
    subtitle: 'I manage a store',
  },
];

export function RegisterPage() {
  const [role, setRole] = useState<'shopper' | 'retailer'>('shopper');
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');

    if (!fullName || !emailAddress || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    const result = await register(emailAddress, password, role, fullName);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Registration failed.');
      return;
    }

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
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-[10px] font-black">WA</span>
          </div>
          <span className="font-bold text-base text-text-main">WenArkhass</span>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-text-main mb-3">
              Join WenArkhass
            </h1>
            <p className="text-base text-text-muted leading-relaxed max-w-sm">
              Join a growing network of shoppers and retailers helping make prices across Lebanon more transparent.
            </p>
          </div>

          <div className="flex items-center gap-8">
            {[
              { value: '12K+', label: 'Shoppers' },
              { value: '800+', label: 'Stores' },
              { value: '45K+', label: 'Prices' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-text-main">{stat.value}</p>
                <p className="text-sm text-text-muted mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-text-muted">
          © 2025 WenArkhass. Built for Lebanon.
        </p>
      </motion.div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-[10px] font-black">WA</span>
            </div>
            <span className="font-bold text-base text-text-main">WenArkhass</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-main mb-1">Create your account</h2>
            <p className="text-sm text-text-muted">
              It’s free to join and start tracking prices and availability.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {ROLE_CARDS.map((card) => (
              <button
                key={card.id}
                onClick={() => setRole(card.id)}
                className={cn(
                  'p-5 rounded-lg border text-left transition-all relative overflow-hidden',
                  role === card.id
                    ? 'border-primary bg-white shadow-soft ring-1 ring-primary/20'
                    : 'border-border-primary bg-bg-surface hover:border-primary/30'
                )}
              >
                <span
                  className={cn(
                    'material-symbols-outlined text-[24px] block mb-3',
                    role === card.id ? 'text-primary' : 'text-text-muted'
                  )}
                >
                  {card.icon}
                </span>

                <p className="text-base font-bold text-text-main leading-none">
                  {card.title}
                </p>
                <p className="text-[11px] font-bold text-text-muted mt-1.5">{card.subtitle}</p>

                {role === card.id && (
                  <motion.div layoutId="role-indicator" className="absolute top-3 right-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      check_circle
                    </span>
                  </motion.div>
                )}
              </button>
            ))}
          </div>

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
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted">Full name</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px] group-focus-within:text-primary transition-colors">
                  person
                </span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-bg-surface border border-border-primary rounded-md text-sm font-medium text-text-main placeholder:text-text-muted/40 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted">Email address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px] group-focus-within:text-primary transition-colors">
                  mail
                </span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-bg-surface border border-border-primary rounded-md text-sm font-medium text-text-main placeholder:text-text-muted/40 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted">Password</label>
              <div className="space-y-3">
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[18px] group-focus-within:text-primary transition-colors">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                <PasswordStrengthBar password={password} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted">Confirm password</label>
              <div className="relative group">
                <span
                  className={cn(
                    'material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] transition-colors group-focus-within:text-primary',
                    confirmPassword && confirmPassword !== password ? 'text-red-400' : 'text-text-muted'
                  )}
                >
                  {confirmPassword && confirmPassword !== password ? 'lock_open' : 'lock_person'}
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(
                    'w-full h-12 pl-12 pr-4 bg-bg-surface border rounded-md text-sm font-medium text-text-main placeholder:text-text-muted/40 outline-none focus:ring-4 transition-all',
                    confirmPassword && confirmPassword !== password
                      ? 'border-red-400 focus:ring-red-400/5'
                      : 'border-border-primary focus:border-primary/50 focus:ring-primary/5'
                  )}
                />
              </div>
            </div>

            <div className="py-4 border-y border-border-soft">
              <p className="text-[10px] text-text-muted font-medium text-center leading-relaxed">
                Your account information is protected and securely stored.
              </p>
            </div>

            <button
              onClick={handleRegister}
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
                  Creating account...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  Create Account
                </>
              )}
            </button>
          </div>

          <p className="text-center text-sm font-medium text-text-muted mt-10 leading-relaxed">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-primary-hover transition-colors underline underline-offset-4 decoration-primary/30"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}