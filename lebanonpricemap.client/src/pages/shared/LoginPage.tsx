import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/types';
import { cn } from '@/lib/utils';

const roles: { value: UserRole; label: string; icon: string; desc: string }[] = [
  { value: 'shopper',  label: 'Shopper',  icon: 'shopping_cart', desc: 'Find the cheapest groceries near you' },
  { value: 'retailer', label: 'Retailer', icon: 'storefront',    desc: 'Manage your store prices and promotions' },
  { value: 'admin',    label: 'Admin',    icon: 'admin_panel_settings', desc: 'Monitor and manage the platform' },
];

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('shopper');
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleLogin = () => {
    login(selectedRole);
    if (selectedRole === 'admin') navigate('/app/admin');
    else if (selectedRole === 'retailer') navigate('/app/retailer');
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
            <span className="text-white text-3xl">🔥</span>
          </div>
          <h1 className="text-3xl font-bold text-text-main">Wein Arkhas</h1>
          <p className="text-sm text-text-muted mt-2">Lebanon's community-driven price comparison</p>
        </div>

        {/* Role selector */}
        <div className="flex flex-col gap-3 mb-8">
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

        {/* Login button */}
        <button
          onClick={handleLogin}
          className="w-full h-14 rounded-2xl bg-primary text-white text-lg font-bold hover:bg-primary-hover transition-colors active:scale-[0.98]"
        >
          Continue as {roles.find(r => r.value === selectedRole)?.label}
        </button>

        <p className="text-center text-xs text-text-muted mt-6">
          Demo mode — select a role to explore the app
        </p>
      </motion.div>
    </div>
  );
}
