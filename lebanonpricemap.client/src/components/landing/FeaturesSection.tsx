import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: 'inventory_2',
    label: 'Official store prices',
    desc: 'Store owners can publish their own prices directly so shoppers can see more accurate updates.',
    color: 'text-primary bg-primary/10 border-primary/20',
  },
  {
    icon: 'rate_review',
    label: 'Community reports',
    desc: 'Shoppers can report price differences, stock issues, and other store updates.',
    color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  },
  {
    icon: 'bolt',
    label: 'Power and cold-chain status',
    desc: 'Check store power conditions before buying dairy, frozen food, or infant products.',
    color: 'text-amber-500 bg-amber-400/10 border-amber-400/20',
  },
  {
    icon: 'route',
    label: 'Cart optimization',
    desc: 'Compare stores and find the lowest total cost for your shopping list.',
    color: 'text-green-500 bg-green-500/10 border-green-500/20',
  },
  {
    icon: 'verified_user',
    label: 'Trust score system',
    desc: 'Reports are weighted by trust to help surface more reliable information.',
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  },
  {
    icon: 'currency_exchange',
    label: 'Exchange-rate visibility',
    desc: 'Track store pricing behavior and see where internal rate differences may affect costs.',
    color: 'text-red-400 bg-red-400/10 border-red-400/20',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-28 bg-bg-base border-t border-border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="mb-16 max-w-2xl">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">
            What WenArkhass does
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-text-main leading-tight mb-4">
            Everything a Lebanese shopper needs.
          </h2>

          <p className="text-text-muted font-medium text-base leading-relaxed">
            Built around the realities of Lebanon — changing prices, inconsistent stock, power outages, and multiple exchange-rate pressures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="bg-bg-surface border border-border-primary/15 rounded-3xl p-7 hover:border-primary/30 transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 ${feature.color}`}>
                <span className="material-symbols-outlined text-[22px]">{feature.icon}</span>
              </div>

              <h3 className="font-black text-text-main text-base mb-2 group-hover:text-primary transition-colors leading-tight">
                {feature.label}
              </h3>

              <p className="text-sm text-text-muted font-medium leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}