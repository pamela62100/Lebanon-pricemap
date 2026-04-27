import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { usersApi } from '@/api/users.api';

const ROLE_DESTINATIONS: Record<string, string> = {
  shopper: '/app',
  retailer: '/retailer',
  admin: '/admin',
};

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) {
      setForgotError('Please enter your email address.');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    try {
      await usersApi.forgotPassword(forgotEmail.trim());
    } catch {
      // Silently succeed — never reveal whether email exists
    } finally {
      setForgotLoading(false);
      setForgotSent(true);
    }
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Sign in failed. Please try again.');
      return;
    }

    const user = useAuthStore.getState().user;
    const destination = ROLE_DESTINATIONS[user?.role ?? 'shopper'] ?? '/app';
    navigate(destination);
  };

  return (
    <div className="min-h-screen bg-bg-base flex">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-white border-r border-border-primary p-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-[10px] font-black">WA</span>
          </div>
          <span className="font-bold text-base text-text-main">WenArkhass</span>
        </Link>

        {/* Copy */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-text-main mb-3">
              Welcome back
            </h1>
            <p className="text-base text-text-muted leading-relaxed max-w-sm">
              Check prices, compare stores, and stay updated on what's available near you — before you leave home.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: 'verified', label: 'Verified prices', desc: 'Official store prices and trusted community updates.' },
              { icon: 'security', label: 'More reliable reports', desc: 'Trust scores help surface better price information.' },
              { icon: 'groups', label: 'Built for Lebanon', desc: 'Compare prices, track stock, and shop with more confidence.' },
            ].map((item, index) => (
              <motion.div
                key={item.icon}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-bg-base border border-border-soft rounded-xl"
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-border-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-text-main text-[18px]">{item.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-main">{item.label}</p>
                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-xs text-text-muted">© 2025 WenArkhass. Built for Lebanon.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-[10px] font-black">WA</span>
            </div>
            <span className="font-bold text-base text-text-main">WenArkhass</span>
          </Link>

          <AnimatePresence mode="wait">
            {forgotMode ? (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-text-main mb-1">Reset your password</h2>
                  <p className="text-sm text-text-muted">
                    Enter your email and we'll send you a reset link.
                  </p>
                </div>

                {forgotSent ? (
                  <div className="p-6 rounded-2xl bg-green-50 border border-green-200 text-center space-y-3">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                      <span className="material-symbols-outlined text-green-600 text-2xl">mark_email_read</span>
                    </div>
                    <p className="text-sm font-semibold text-text-main">Check your inbox</p>
                    <p className="text-sm text-text-muted">
                      If <span className="font-medium text-text-main">{forgotEmail}</span> has an account, you'll receive a reset link shortly.
                    </p>
                    <button
                      onClick={() => { setForgotMode(false); setForgotSent(false); setForgotEmail(''); }}
                      className="text-sm font-semibold text-primary hover:underline underline-offset-4 mt-2"
                    >
                      Back to sign in
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {forgotError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                        <span className="material-symbols-outlined text-red-500 text-[18px]">error</span>
                        <p className="text-red-600 text-sm">{forgotError}</p>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-main">Email address</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">mail</span>
                        <input
                          type="email"
                          placeholder="name@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleForgotPassword()}
                          className="w-full h-11 pl-11 pr-4 bg-white border border-border-primary rounded-xl text-sm text-text-main placeholder:text-text-muted/50 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/5 transition-all"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleForgotPassword}
                      disabled={forgotLoading}
                      className="w-full h-11 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                    >
                      {forgotLoading ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                            className="material-symbols-outlined text-[18px]"
                          >
                            progress_activity
                          </motion.span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">send</span>
                          Send reset link
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForgotMode(false)}
                      className="w-full text-sm font-medium text-text-muted hover:text-text-main transition-colors"
                    >
                      Back to sign in
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-text-main mb-1">Sign in</h2>
                  <p className="text-sm text-text-muted">
                    Access your account to track prices, alerts, and store updates.
                  </p>
                </div>

                {/* Demo accounts notice */}
                <div className="mb-6 p-3.5 rounded-xl bg-bg-muted border border-border-primary text-sm text-text-muted leading-relaxed">
                  <span className="font-semibold text-text-main">Demo accounts: </span>
                  Use <code className="text-text-main font-mono text-xs">habib@test.com</code> or{' '}
                  <code className="text-text-main font-mono text-xs">admin@wein.app</code> with password{' '}
                  <code className="text-text-main font-mono text-xs">Test1234!</code>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-red-500 text-[18px]">error</span>
                    <p className="text-red-600 text-sm">{error}</p>
                  </motion.div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-main">Email address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">mail</span>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        className="w-full h-11 pl-11 pr-4 bg-white border border-border-primary rounded-xl text-sm text-text-main placeholder:text-text-muted/50 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-text-main">Password</label>
                      <button
                        type="button"
                        onClick={() => setForgotMode(true)}
                        className="text-xs font-medium text-primary hover:underline underline-offset-4 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">lock</span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        className="w-full h-11 pl-11 pr-11 bg-white border border-border-primary rounded-xl text-sm text-text-main placeholder:text-text-muted/50 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/5 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
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
                    className="w-full h-11 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-60"
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

                <p className="text-center text-sm text-text-muted mt-8">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-semibold text-text-main hover:underline underline-offset-4">
                    Create one
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
