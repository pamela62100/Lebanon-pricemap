import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-24 bg-bg-base">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-border-primary/20 rounded-2xl p-8 sm:p-12 text-center shadow-card"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-3">
            Ready to start saving?
          </h2>
          <p className="text-base text-text-muted mb-8 max-w-lg mx-auto">
            Join thousands of Lebanese shoppers comparing prices and finding the best deals near them.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/register')}
              className="h-11 px-8 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
            >
              Create a free account
              <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="h-11 px-8 border border-border-primary text-text-main font-semibold rounded-xl hover:border-primary transition-all text-sm w-full sm:w-auto justify-center"
            >
              Sign in
            </button>
          </div>

          <p className="text-xs text-text-muted mt-5">Free to use. No credit card required.</p>
        </motion.div>
      </div>
    </section>
  );
}
