// src/components/landing/HeroSection.tsx
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function HeroSection() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true, margin: '-100px' });

  return (
    <section ref={heroRef} className="relative min-h-screen w-full flex items-center justify-center p-8 pt-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-[0.15]">
        <div className="absolute inset-0 blueprint-grid" />
        <img 
          src="/beirut_architectural_blueprint.png" 
          alt="Structural Blueprint" 
          className="w-full h-full object-cover grayscale mix-blend-multiply opacity-50"
        />
      </div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center max-w-6xl p-12 lg:p-24 border border-text-main/5 bg-bg-base/20 backdrop-blur-[2px]"
      >
        <h1 className="text-display text-text-main mb-12 leading-[0.82] font-black uppercase tracking-tighter">
          Precision in <br />
          <span className="text-primary">Extreme Economy.</span>
        </h1>
        <p className="text-text-sub text-xl tracking-tight mb-16 max-w-3xl mx-auto font-medium leading-relaxed">
          Lebanon's first high-fidelity price mapping network. <br />
          <span className="text-text-muted">Built for transparency. Engineered for the civilian protocol.</span>
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6 items-center">
          <button 
            onClick={() => navigate('/app')}
            className="btn-consulate h-16 px-16 group bg-text-main text-bg-base border-text-main shadow-[4px_4px_0px_#0066FF] text-[11px]"
          >
            <span>INITIALIZE_SENSORS</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform ml-4">radar</span>
          </button>
          <button 
             onClick={() => navigate('/login')}
             className="btn-consulate btn-outline h-16 px-16 text-[11px] border-text-main text-text-main hover:bg-text-main hover:text-bg-base"
          >
            SECURE_ACCESS
          </button>
        </div>
      </motion.div>
    </section>
  );
}