import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: 'inventory_2',
    label: 'Official store prices',
    desc: 'Store owners publish their own prices directly so shoppers see accurate, up-to-date information.',
    color: 'text-slate-700 bg-slate-100 border-slate-200',
  },
  {
    icon: 'rate_review',
    label: 'Community reports',
    desc: 'Shoppers report price differences, stock issues, and other store updates in real time.',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  },
  {
    icon: 'bolt',
    label: 'Power & cold-chain status',
    desc: 'Check store power conditions before buying dairy, frozen food, or infant products.',
    color: 'text-amber-600 bg-amber-50 border-amber-100',
  },
  {
    icon: 'route',
    label: 'Cart optimizer',
    desc: 'Add items to your list and find the store combination that saves you the most on your total.',
    color: 'text-green-600 bg-green-50 border-green-100',
  },
  {
    icon: 'verified_user',
    label: 'Trust score system',
    desc: 'Reports are weighted by trust scores to surface more reliable, verified information.',
    color: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    icon: 'currency_exchange',
    label: 'Exchange-rate tracking',
    desc: 'See how internal exchange rates affect store prices and compare across different pricing methods.',
    color: 'text-rose-600 bg-rose-50 border-rose-100',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-24 lg:py-28 bg-bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="mb-12 max-w-xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-main mb-3">
            Everything a Lebanese shopper needs
          </h2>
          <p className="text-base text-text-muted leading-relaxed">
            Built around the realities of Lebanon — changing prices, inconsistent stock, power outages, and currency pressures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.07, duration: 0.4 }}
              className="bg-white border border-border-primary/20 rounded-2xl p-6 hover:shadow-card transition-all"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-5 ${feature.color}`}>
                <span className="material-symbols-outlined text-[20px]">{feature.icon}</span>
              </div>
              <h3 className="font-semibold text-text-main mb-1.5">{feature.label}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
