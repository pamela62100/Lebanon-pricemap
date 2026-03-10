import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-bg-base relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-bg-surface border border-border-primary/20 rounded-[32px] p-8 sm:p-10 md:p-14 text-center shadow-glass"
        >
          <p className="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-5">
            Join WenArkhass
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-main leading-tight mb-6">
            Ready to shop with more confidence?
          </h2>

          <p className="text-base sm:text-lg text-text-muted font-medium mb-8 max-w-2xl mx-auto">
            Track prices, compare stores, and help make the Lebanese market more transparent for everyone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="h-12 sm:h-14 px-8 bg-primary text-white font-bold rounded-2xl hover:opacity-90 transition-all flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
            >
              Get Started Free
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="h-12 sm:h-14 px-8 border border-border-primary text-text-main font-bold rounded-2xl hover:border-primary hover:text-primary transition-all text-sm w-full sm:w-auto justify-center"
            >
              Already have an account?
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}