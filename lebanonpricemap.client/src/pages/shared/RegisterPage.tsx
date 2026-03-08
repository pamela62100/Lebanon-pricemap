import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/types';
import { cn } from '@/lib/utils';

const roles: { value: UserRole; label: string; icon: string; desc: string }[] = [
  { value: 'shopper',  label: 'Shopper',  icon: 'shopping_cart', desc: 'Find the cheapest groceries near you' },
  { value: 'retailer', label: 'Store Owner', icon: 'storefront', desc: 'Manage your store prices and promotions' },
];

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);

  const initialRole = (searchParams.get('role') as UserRole) ?? 'shopper';
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    roles.some(r => r.value === initialRole) ? initialRole : 'shopper'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const role = searchParams.get('role') as UserRole;
    if (role && roles.some(r => r.value === role)) setSelectedRole(role);
  }, [searchParams]);

  const handleRegister = () => {
    if (!name.trim()) return;
    login(selectedRole);
    if (selectedRole === 'retailer') navigate('/retailer');
    else navigate('/app');
  };

  return (
    <div className="min-h-dvh bg-bg-base flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-white" style={{ fontSize: '32px' }}>map</span>
          </div>
          <h1 className="text-3xl font-bold text-text-main">Create your account</h1>
          <p className="text-sm text-text-muted mt-2">Join Lebanon's community price map</p>
        </div>

        {/* Name field */}
        <div className="mb-5">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wide block mb-2">Your name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Layla Khoury"
            className="w-full h-12 px-4 rounded-2xl bg-bg-surface border border-border-soft text-text-main text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Email field */}
        <div className="mb-6">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wide block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full h-12 px-4 rounded-2xl bg-bg-surface border border-border-soft text-text-main text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Role selector */}
        <div className="flex flex-col gap-3 mb-8">
          <p className="text-xs font-bold text-text-muted uppercase tracking-wide">I am a…</p>
          {roles.map(role => (
            <button
              key={role.value}
              onClick={() => setSelectedRole(role.value)}
              className={cn(
                'flex items-center gap-4 p-4 rounded-2xl border text-left transition-all',
                selectedRole === role.value
                  ? 'border-primary bg-primary-soft shadow-sm'
                  : 'border-border-soft bg-bg-surface hover:border-border-primary'
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                selectedRole === role.value ? 'bg-primary text-white' : 'bg-bg-muted text-text-sub'
              )}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{role.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-text-main">{role.label}</p>
                <p className="text-xs text-text-muted mt-0.5">{role.desc}</p>
              </div>
              <div className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                selectedRole === role.value ? 'border-primary' : 'border-border-soft'
              )}>
                {selectedRole === role.value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </div>
            </button>
          ))}
        </div>

        {/* Register button */}
        <button
          onClick={handleRegister}
          disabled={!name.trim()}
          className="w-full h-14 rounded-2xl bg-primary text-white text-lg font-bold hover:bg-primary-hover transition-colors active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Create Account →
        </button>

        <p className="text-center text-xs text-text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
        <p className="text-center text-[10px] text-text-muted mt-2">Demo mode — no real data is stored</p>
      </motion.div>
    </div>
  );
}
