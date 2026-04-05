import { motion } from 'framer-motion';

export default function QuoteSection() {
  return (
    <section className="py-20 relative bg-text-main overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="material-symbols-outlined text-white/20 text-5xl mb-6 block">
            format_quote
          </span>

          <p className="text-2xl md:text-3xl font-medium text-white/90 leading-relaxed mb-8">
            "In uncertain times, clear information helps people make smarter choices for their families."
          </p>

          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-white/20" />
            <p className="text-sm font-semibold text-white/40">WenArkhass</p>
            <div className="h-px w-10 bg-white/20" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
