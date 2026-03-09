import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: 'inventory_2',
    label: 'Official Catalog Prices',
    desc: 'Store owners publish their own prices directly. No guessing — always from the source.',
    color: 'text-primary bg-primary/10 border-primary/20',
  },
  {
    icon: 'rate_review',
    label: 'Community Discrepancy Reports',
    desc: 'When shelf price doesn\'t match the catalog, shoppers report it. Admin resolves it fast.',
    color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  },
  {
    icon: 'bolt',
    label: 'Power & Cold Chain Status',
    desc: 'Know if a store has stable power before buying dairy or infant formula.',
    color: 'text-amber-500 bg-amber-400/10 border-amber-400/20',
  },
  {
    icon: 'route',
    label: 'Cart Optimizer',
    desc: 'Add products to your cart. We calculate the cheapest store combination in real time.',
    color: 'text-green-500 bg-green-500/10 border-green-500/20',
  },
  {
    icon: 'verified_user',
    label: 'Trust Score System',
    desc: 'Every report is weighted by the reporter\'s trust score. Bad data never floats to the top.',
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  },
  {
    icon: 'currency_exchange',
    label: 'Dual-Rate Transparency',
    desc: 'We flag stores whose internal USD rate differs from the market by more than 500 LBP.',
    color: 'text-red-400 bg-red-400/10 border-red-400/20',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-28 bg-bg-base border-t border-border-primary/10">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">What we do</p>
          <h2 className="text-5xl font-black text-text-main leading-tight mb-4">
            Everything a Lebanese<br />shopper needs.
          </h2>
          <p className="text-text-muted font-medium text-base leading-relaxed">
            Built from the ground up for the realities of Lebanon — hyperinflation, power outages, and multiple exchange rates.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-bg-surface border border-border-primary/15 rounded-3xl p-7 hover:border-primary/30 transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 ${f.color}`}>
                <span className="material-symbols-outlined text-[22px]">{f.icon}</span>
              </div>
              <h3 className="font-black text-text-main text-base mb-2 group-hover:text-primary transition-colors leading-tight">{f.label}</h3>
              <p className="text-sm text-text-muted font-medium leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}