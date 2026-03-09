import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';

const STATS = [
  { value: '12K+', label: 'Shoppers' },
  { value: '800+', label: 'Stores' },
  { value: '45K+', label: 'Prices' },
  { value: 'Daily', label: 'Updates' },
];

const TRUST_ITEMS = [
  { icon: 'verified', text: 'Official catalog prices from store owners' },
  { icon: 'security', text: 'Anti-fraud trust score system' },
  { icon: 'bolt', text: 'Real-time power & cold-chain status' },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-bg-base">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[100px]" />
        <div className="absolute inset-0 blueprint-grid opacity-[0.03]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-12 pt-32 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Copy */}
          <div>
            {/* Eyebrow pill */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Lebanon's First Live Price Map</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-text-main leading-[1.0] mb-6"
            >
              Buy smarter.<br />
              <span className="text-primary">Spend less.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-text-muted font-medium leading-relaxed mb-8 max-w-lg"
            >
              Real prices from verified supermarkets across Lebanon — updated live by store owners and the community.
            </motion.p>

            {/* Trust items */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col gap-2.5 mb-10"
            >
              {TRUST_ITEMS.map(item => (
                <div key={item.icon} className="flex items-center gap-3 text-sm text-text-sub font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[13px]">{item.icon}</span>
                  </div>
                  {item.text}
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-4 flex-wrap"
            >
              <button
                onClick={() => navigate(user ? '/app' : '/register')}
                className="h-14 px-8 bg-primary text-white font-bold rounded-2xl hover:opacity-90 transition-all flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                {user ? 'Open App' : 'Get Started Free'}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="h-14 px-8 border border-border-primary text-text-main font-bold rounded-2xl hover:border-primary hover:text-primary transition-all text-sm"
              >
                Sign In
              </button>
            </motion.div>
          </div>

          {/* RIGHT: Floating data card mock */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            {/* Floating card mockup */}
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl blur-2xl" />
              <div className="relative bg-bg-surface border border-border-primary/30 rounded-3xl p-8 shadow-glass">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs font-black">W.A</span>
                    </div>
                    <span className="font-black text-text-main text-sm">WeinArkhas</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Live</span>
                  </div>
                </div>

                {[
                  { name: 'Full Cream Milk 1L', store: 'Spinneys Beirut', price: '145,000', trend: 'down', pct: '−3%' },
                  { name: 'Pita Bread (10 pcs)', store: 'Carrefour Dbayeh', price: '52,000', trend: 'up', pct: '+5%' },
                  { name: 'Olive Oil 750ml', store: 'Bou Khalil Hazmieh', price: '380,000', trend: 'stable', pct: '0%' },
                ].map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-bg-muted border border-border-primary/10 mb-3 last:mb-0"
                  >
                    <div>
                      <p className="text-xs font-bold text-text-main">{p.name}</p>
                      <p className="text-[10px] text-text-muted">{p.store}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary tabular-nums">{p.price}</p>
                      <p className={`text-[9px] font-bold ${p.trend === 'down' ? 'text-green-500' : p.trend === 'up' ? 'text-red-400' : 'text-text-muted'}`}>{p.pct}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t border-border-soft">
                  {STATS.map(s => (
                    <div key={s.label} className="text-center">
                      <p className="text-lg font-black text-text-main">{s.value}</p>
                      <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}