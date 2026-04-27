import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usersApi } from '@/api/users.api';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (!token) { setError('This reset link is invalid or has expired.'); return; }

    setLoading(true);
    try {
      await usersApi.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Reset link is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-bg-base flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-[10px] font-black">WA</span>
          </div>
          <span className="font-bold text-base text-text-main">WenArkhass</span>
        </Link>

        {success ? (
          <div className="p-6 rounded-2xl bg-green-50 border border-green-200 text-center space-y-3">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-green-600 text-2xl">check_circle</span>
            </div>
            <p className="text-sm font-semibold text-text-main">Password reset</p>
            <p className="text-sm text-text-muted">Redirecting you to sign in…</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-main mb-1">Choose a new password</h2>
              <p className="text-sm text-text-muted">Pick something strong you'll remember.</p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 text-[18px]">error</span>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-main">New password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">lock</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full h-11 pl-11 pr-11 bg-white border border-border-primary rounded-xl text-sm text-text-main outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
                  >
                    <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-main">Confirm password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">lock</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Re-enter your password"
                    className="w-full h-11 pl-11 pr-4 bg-white border border-border-primary rounded-xl text-sm text-text-main outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/5"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-11 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-60"
              >
                {loading ? 'Saving…' : 'Reset password'}
              </button>

              <Link to="/login" className="block text-center text-sm text-text-muted hover:text-text-main">
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
