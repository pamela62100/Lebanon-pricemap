import { useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────
const HERO_IMAGE = '/beirut_architectural_blueprint.png'; 

// ─── Scroll-reveal wrapper ────────────────────────────────────────────────────
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  
  return (
    <div className="min-h-screen bg-bg-base overflow-x-hidden blueprint-grid">
      {/* ── Technical Top Nav ────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 h-20 flex items-center justify-between px-8 md:px-16 border-b border-border-primary/50 bg-bg-base/80 backdrop-blur-md">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/app')}>
          <div className="w-10 h-10 bg-text-main flex items-center justify-center shadow-[2px_2px_0px_#0066FF]">
            <span className="text-bg-base text-lg font-serif font-black tracking-tighter">WW</span>
          </div>
          <span className="font-serif text-xl font-black text-text-main tracking-tight uppercase">Wein Wrkhas</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="btn-consulate h-10 px-6 text-[9px]"
        >
          Secure Access
        </button>
      </header>

      {/* ── Section 1: Hero (Architectural Precision) ─────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen w-full flex items-center justify-center p-8 pt-32 overflow-hidden">
        {/* Background Blueprint */}
        <div className="absolute inset-0 z-0 opacity-[0.15]">
          <div className="absolute inset-0 blueprint-grid" />
          <img 
            src="/beirut_architectural_blueprint.png" 
            alt="Structural Blueprint" 
            className="w-full h-full object-cover grayscale mix-blend-multiply opacity-50"
          />
        </div>

        {/* Technical Coordinate Overlay */}
        <div className="absolute top-32 left-8 hidden lg:block">
          <div className="border-l border-primary pl-4 py-8">
            <p className="text-[9px] font-black text-primary uppercase tracking-[0.5em] mb-4">MAP_COORDINATES</p>
            <div className="space-y-4 text-[10px] text-text-muted font-bold tracking-widest font-mono">
              <p>LAT: 33.8938 N</p>
              <p>LNG: 35.5018 E</p>
              <div className="h-20 w-[1px] bg-border-soft ml-2" />
              <p className="text-primary italic">SEQ // 0842-X</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-center max-w-6xl animate-page p-12 lg:p-24 border border-text-main/5 bg-bg-base/20 backdrop-blur-[2px]">
          <div className="inline-flex items-center gap-4 mb-10">
            <span className="h-[2px] w-12 bg-primary shadow-[2px_2px_0px_rgba(0,102,255,0.3)]" />
            <span className="text-[10px] font-black tracking-[0.5em] uppercase text-primary">Consulate Intelligence Port v4.1</span>
            <span className="h-[2px] w-12 bg-primary shadow-[2px_2px_0px_rgba(0,102,255,0.3)]" />
          </div>
          
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
        </div>
        
        {/* Bottom Data Strip - Architectural Band */}
        <div className="absolute bottom-0 left-0 w-full h-20 border-t border-text-main bg-bg-surface flex items-center px-8 md:px-16 overflow-hidden z-20">
           <div className="flex items-center gap-12 whitespace-nowrap animate-marquee">
              {[
                { l: 'MARKET_RATE', v: '89,500' },
                { l: 'CONSUMER_PRICE_INDEX', v: 'STABLE' },
                { l: 'BREAD_MONITOR', v: 'LBP 65K' },
                { l: 'GEOSPATIAL_NODES', v: '1,248' },
                { l: 'NETWORK_LATENCY', v: '12ms' },
                { l: 'VERIFIED_TP', v: '99.8%' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                   <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] group-hover:text-primary transition-colors">{item.l}</span>
                   <span className="font-serif font-black text-lg text-text-main border-b border-primary/20">{item.v}</span>
                   <span className="text-border-soft ml-8 opacity-40">[]</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* ── Section 2: Logic (The Blueprint) ─────────────────── */}
      <section className="py-40 px-8 md:px-16 border-b border-border-primary">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
           <div>
              <span className="text-primary font-bold text-[10px] tracking-[0.5em] uppercase mb-8 block">01 // THE PROTOCOL</span>
              <h2 className="text-display text-text-main mb-12 leading-none uppercase">
                Mapping the <br />
                Invisible <span className="text-text-muted">Market.</span>
              </h2>
              <p className="text-xl text-text-sub font-medium leading-relaxed max-w-lg mb-8">
                In an era of rapid devaluation, data is your strongest shield. Wein Wrkhas provides a verifiable structural map of Lebanon's essential prices—updated hourly by a decentralized network of citizens.
              </p>
              <div className="grid grid-cols-2 gap-8 border-t border-border-primary pt-12">
                 <div>
                    <p className="text-mono-data text-4xl text-text-main font-bold mb-2">99.8%</p>
                    <p className="text-[9px] font-bold text-text-muted tracking-widest uppercase">Verification Reliability</p>
                 </div>
                 <div>
                    <p className="text-mono-data text-4xl text-text-main font-bold mb-2">12ms</p>
                    <p className="text-[9px] font-bold text-text-muted tracking-widest uppercase">System Latency</p>
                 </div>
              </div>
           </div>
           
           <div className="bg-text-main p-1 shadow-[8px_8px_0px_#0066FF]">
              <div className="bg-bg-base p-8 border border-text-main min-h-[400px] flex flex-col justify-between">
                 <div className="flex justify-between items-start mb-12">
                    <span className="text-[9px] font-bold tracking-widest text-text-muted uppercase">Terminal Status [STABLE]</span>
                    <span className="w-2 h-2 bg-green-500 animate-pulse" />
                 </div>
                 <div className="space-y-6">
                    <div className="h-px bg-border-soft" />
                    <div className="h-4 bg-bg-muted w-3/4" />
                    <div className="h-px bg-border-soft" />
                    <div className="h-4 bg-bg-muted w-1/2" />
                    <div className="h-px bg-border-soft" />
                    <div className="h-4 bg-bg-muted w-full" />
                 </div>
                 <div className="mt-12">
                    <p className="text-mono-data text-primary text-xs">// VERIFYING_RECEIPT_0842...</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ── Section 3: Feature Architecture (Technical Series) ──────────────── */}
      <section className="py-40 bg-bg-surface">
        <div className="container mx-auto px-8 md:px-16">
          <div className="flex justify-between items-end mb-24 border-b border-border-primary pb-12">
            <div>
              <span className="text-primary font-bold text-[10px] tracking-[0.5em] uppercase mb-6 block">02 // SPECIFICATIONS</span>
              <h3 className="text-headline uppercase">Operational Modules</h3>
            </div>
            <p className="text-text-muted text-[10px] font-bold tracking-widest hidden md:block uppercase">Consulate v4.0.1</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'MARKET PULSE', desc: 'Real-time structural monitoring of essential availability.' },
              { title: 'STORE RATE AUDIT', desc: 'Pre-emptive verification of internal exchange rates.' },
              { title: 'POWER STABILITY', desc: 'Citizen-led logging of cold-chain reliability and generator health.' },
              { title: 'DEPTH LOGISTICS', desc: 'Wait-time and car-count monitoring for high-demand stations.' },
              { title: 'SPATIAL DEPTH', desc: 'High-precision coordinate mapping of regional cost-floors.' },
              { title: 'VERIFIED TRUST', desc: 'Receipt-backed authority scoring for system contributors.' }
            ].map((f, i) => (
              <div key={i} className="card p-12 hover:border-primary group">
                <div className="flex justify-between items-start mb-12">
                   <span className="text-mono-data text-primary text-xs">M_{String(i+1).padStart(2, '0')}</span>
                   <span className="material-symbols-outlined text-text-muted group-hover:text-primary" style={{ fontSize: '20px' }}>settings_accessibility</span>
                </div>
                <h4 className="font-serif text-2xl text-text-main mb-4 uppercase">{f.title}</h4>
                <p className="text-text-muted text-sm font-medium leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Visual Break (Structural) ───────────── */}
      <section className="h-[50vh] relative p-16 flex items-center justify-center bg-text-main overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="w-full h-full blueprint-grid" />
        </div>
        <div className="relative z-10 text-center text-bg-base max-w-2xl px-12 py-16 border border-bg-base/20">
          <h2 className="font-serif text-4xl mb-8 uppercase leading-tight font-black">
            "Sovereignty Through <br />
            <span className="text-primary italic">Information.</span>"
          </h2>
          <div className="h-px w-24 bg-primary mx-auto mb-8" />
          <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-text-muted">Citizens Intelligence Network</p>
        </div>
      </section>

      {/* ── Section 5: CTA (Deployment) ────────────────────────────────────────────────── */}
      <section className="py-40 text-center container mx-auto px-8">
         <div className="max-w-2xl mx-auto border border-border-primary p-20 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bg-base px-6">
               <span className="text-primary text-[10px] font-bold tracking-[0.5em] uppercase">DEPLOYMENT_GATE</span>
            </div>
            <h2 className="text-display mb-12 uppercase leading-none">
              Initialize <br /> 
              The <span className="text-text-muted">Portal.</span>
            </h2>
            <button
             onClick={() => navigate('/login')}
             className="btn-consulate px-16 h-16 text-[11px]"
            >
              Access Identity Panel
            </button>
         </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-border-primary bg-bg-surface px-8 md:px-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 bg-text-main flex items-center justify-center">
                <span className="text-bg-base text-[10px] font-serif font-black">WW</span>
             </div>
             <span className="font-serif text-xl font-black uppercase tracking-tight">WEIN WRKHAS</span>
          </div>
          <div className="text-[9px] font-bold tracking-[0.3em] uppercase text-text-muted">
            ARCHITECTURE_v4.1 // LEBANON_PRICE_INTELLIGENCE // © 2026
          </div>
          <div className="flex gap-4">
             {[ 'TERMINAL', 'WHITEPAPER', 'SUPPORT' ].map(link => (
                <span key={link} className="text-[9px] font-bold text-text-muted hover:text-primary cursor-pointer tracking-widest">{link}</span>
             ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
