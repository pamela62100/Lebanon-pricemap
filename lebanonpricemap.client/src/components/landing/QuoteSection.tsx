import { motion } from 'framer-motion';

export default function QuoteSection() {
  return (
    <section className="py-32 relative bg-text-main overflow-hidden">
      {/* Subtle blueprint pattern */}
      <div className="absolute inset-0 opacity-[0.03] blueprint-grid pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-8 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <span className="material-symbols-outlined text-primary text-5xl mb-8 opacity-50">format_quote</span>
          
          <h2 className="text-3xl md:text-5xl font-serif text-bg-base transition-all leading-tight italic mb-10">
            "In times of crisis, information isn't just data — it's <span className="text-primary not-italic font-sans font-black uppercase tracking-tighter">sovereignty</span> for the people."
          </h2>

          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-primary/30" />
            <p className="text-[10px] font-black tracking-[0.5em] uppercase text-bg-base/40">
              The WeinArkhas Manifesto
            </p>
            <div className="h-px w-12 bg-primary/30" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}