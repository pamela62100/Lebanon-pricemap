import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';

const STATS = [
  { value: '12K+', label: 'Shoppers' },
  { value: '800+', label: 'Stores' },
  { value: '45K+', label: 'Prices tracked' },
  { value: 'Daily', label: 'Updates' },
];

const PRODUCTS = [
  { name: 'Full Cream Milk 1L', store: 'Spinneys Beirut', price: '145,000', trend: 'down', pct: '−3%' },
  { name: 'Pita Bread (10 pcs)', store: 'Carrefour Dbayeh', price: '52,000', trend: 'up', pct: '+5%' },
  { name: 'Olive Oil 750ml', store: 'Bou Khalil Hazmieh', price: '380,000', trend: 'stable', pct: '0%' },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-bg-base">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-text-main/5 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-slate-400/8 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 pt-28 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-600">
                Live prices across Lebanon
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-main leading-[1.1] mb-5"
            >
              Find the best prices
              <br />
              <span className="text-text-muted font-normal">before you leave home.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base text-text-muted leading-relaxed mb-8 max-w-md"
            >
              Real prices from stores across Lebanon — submitted by retailers and verified by the community. Compare, save, and shop smarter.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <button
                onClick={() => navigate(user ? '/app' : '/register')}
                className="h-12 px-7 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm"
              >
                {user ? 'Open App' : 'Get Started — It\'s Free'}
                <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
              </button>
              <button
                onClick={() => navigate('/map')}
                className="h-12 px-7 border border-border-primary text-text-main font-semibold rounded-xl hover:border-primary transition-all text-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[17px]">map</span>
                View Price Map
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              {[
                { icon: 'verified', text: 'Verified prices' },
                { icon: 'groups', text: 'Community-powered' },
                { icon: 'lock', text: 'Free to use' },
              ].map((item) => (
                <div key={item.icon} className="flex items-center gap-1.5 text-sm text-text-muted">
                  <span className="material-symbols-outlined text-[15px]">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: live preview card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-text-main/5 to-transparent rounded-3xl blur-2xl" />
              <div className="relative bg-white border border-border-primary/40 rounded-2xl shadow-card overflow-hidden">
                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border-soft">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-white text-[9px] font-black">WA</span>
                    </div>
                    <span className="font-semibold text-text-main text-sm">Live prices</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-green-600">Live</span>
                  </div>
                </div>

                {/* Price rows */}
                <div className="px-5 py-3 divide-y divide-border-soft">
                  {PRODUCTS.map((product, index) => (
                    <motion.div
                      key={product.name}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.12 }}
                      className="flex items-center justify-between py-3.5"
                    >
                      <div>
                        <p className="text-sm font-semibold text-text-main">{product.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{product.store}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-text-main tabular-nums">{product.price} <span className="text-[10px] font-normal text-text-muted">LBP</span></p>
                        <p className={`text-xs font-medium mt-0.5 ${
                          product.trend === 'down' ? 'text-green-500' :
                          product.trend === 'up' ? 'text-red-400' : 'text-text-muted'
                        }`}>
                          {product.pct}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-0 border-t border-border-soft bg-bg-muted/30">
                  {STATS.map((stat, i) => (
                    <div key={stat.label} className={`text-center py-4 ${i < 3 ? 'border-r border-border-soft' : ''}`}>
                      <p className="text-base font-bold text-text-main">{stat.value}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">{stat.label}</p>
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
