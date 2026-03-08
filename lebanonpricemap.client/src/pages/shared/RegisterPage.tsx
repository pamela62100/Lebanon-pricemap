import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export function RegisterPage() {
  const [role, setRole] = useState<'shopper' | 'retailer'>('shopper');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const register = useAuthStore(s => s.register); // function from your store
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!email || !password) return;

    const name = role === 'shopper' ? email.split('@')[0] : ''; // shoppers get email prefix as name

    // Call register with separate arguments
    register(email, password, role, name);

    if (role === 'retailer') navigate('/retailer');
    else navigate('/app');
  };

  return (
    <div className="max-w-md mx-auto space-y-8 p-6">
      <header className="text-center">
        <h1 className="text-3xl font-black text-primary">Join "Where Cheapest"</h1>
        <p className="text-text-muted mt-2">Lebanon's first interactive price map</p>
      </header>

      <form
        className="space-y-4"
        onSubmit={e => { e.preventDefault(); handleRegister(); }}
      >
        <div>
          <label className="text-sm font-bold">Email</label>
          <input
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-border-soft bg-white focus:ring-2 ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-bold">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border border-border-soft bg-white focus:ring-2 ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            type="button"
            onClick={() => setRole('shopper')}
            className={`p-4 rounded-2xl border-2 transition-all ${role === 'shopper' ? 'border-primary bg-primary/5' : 'border-border-soft'}`}
          >
            <span className="block text-xl">🛒</span>
            <span className="font-bold">Shopper</span>
            <span className="block text-[10px] opacity-60">I want to save money</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('retailer')}
            className={`p-4 rounded-2xl border-2 transition-all ${role === 'retailer' ? 'border-primary bg-primary/5' : 'border-border-soft'}`}
          >
            <span className="block text-xl">🏢</span>
            <span className="font-bold">Retailer</span>
            <span className="block text-[10px] opacity-60">I want to update prices</span>
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
        >
          Get Started Free
        </button>
      </form>
    </div>
  );
}