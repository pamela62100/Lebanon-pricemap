import { motion } from 'framer-motion';

export default function QuoteSection() {
  return (
    <section className="py-32 relative bg-text-main overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] blueprint-grid pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="material-symbols-outlined text-primary text-5xl mb-8 opacity-50">
            format_quote
          </span>

          <h2 className="text-3xl md:text-5xl font-serif text-bg-base transition-all leading-tight italic mb-10">
            &quot;In uncertain times, clear information helps people make smarter choices for their families.&quot;
          </h2>

          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-primary/30" />
            <p className="text-[10px] font-black tracking-[0.5em] uppercase text-bg-base/40">
              WenArkhass
            </p>
            <div className="h-px w-12 bg-primary/30" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}