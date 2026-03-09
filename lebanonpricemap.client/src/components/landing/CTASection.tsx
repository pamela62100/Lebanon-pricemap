import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-32 bg-bg-base relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-bg-surface border border-border-primary/20 rounded-[40px] p-12 md:p-20 text-center shadow-glass"
        >
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6">Join the movement</p>
          <h2 className="text-4xl md:text-6xl font-black text-text-main leading-tight mb-8">
            Ready to shop <br />
            <span className="text-primary">with transparency?</span>
          </h2>
          <p className="text-lg text-text-muted font-medium mb-12 max-w-xl mx-auto">
            Join thousands of shoppers making the Lebanese market more transparent, one price at a time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="h-14 px-10 bg-primary text-white font-bold rounded-2xl hover:opacity-90 transition-all flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
            >
              Get Started for Free
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="h-14 px-10 border border-border-primary text-text-main font-bold rounded-2xl hover:border-primary hover:text-primary transition-all text-sm w-full sm:w-auto justify-center"
            >
              Already a member? Sign In
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}