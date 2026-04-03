import { motion } from 'framer-motion';

const STEPS = [
  {
    number: '01',
    title: 'Search for a product',
    desc: 'Type any product name or scan a barcode to instantly see prices across stores near you.',
    icon: 'search',
  },
  {
    number: '02',
    title: 'Compare prices and stores',
    desc: 'See which store has the lowest price, check stock status, and read community reports.',
    icon: 'compare_arrows',
  },
  {
    number: '03',
    title: 'Optimize your shopping trip',
    desc: 'Add items to your list and let WenArkhass find the store that saves you the most.',
    icon: 'route',
  },
  {
    number: '04',
    title: 'Report what you see',
    desc: 'Spotted a wrong price? Submit a report and earn trust points that make your future reports more visible.',
    icon: 'campaign',
  },
];

export default function LogicSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 md:px-10 lg:px-16 border-y border-border-primary/10 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-main mb-3">
            How it works
          </h2>
          <p className="text-base text-text-muted max-w-xl">
            WenArkhass helps you compare live prices, check product availability, and understand store conditions before making a trip.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="relative"
            >
              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[calc(100%_-_12px)] w-full h-px bg-border-primary/30 z-0" />
              )}

              <div className="relative z-10 bg-bg-base border border-border-primary/20 rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-[18px]">{step.icon}</span>
                  </div>
                  <span className="text-2xl font-bold text-border-primary">{step.number}</span>
                </div>
                <h3 className="font-semibold text-text-main mb-2">{step.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-border-primary/10">
          {[
            { value: '12,000+', label: 'Active shoppers' },
            { value: '800+', label: 'Stores indexed' },
            { value: '45,000+', label: 'Price entries' },
            { value: 'Free', label: 'Always free to use' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-text-main">{stat.value}</p>
              <p className="text-sm text-text-muted mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
