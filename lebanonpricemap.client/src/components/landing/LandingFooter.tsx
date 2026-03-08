// src/components/landing/LandingFooter.tsx
export default function LandingFooter() {
  const links = ['TERMINAL', 'WHITEPAPER', 'SUPPORT'];

  return (
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
          {links.map(link => (
            <span key={link} className="text-[9px] font-bold text-text-muted hover:text-primary cursor-pointer tracking-widest">{link}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}