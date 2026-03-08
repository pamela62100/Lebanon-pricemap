// src/components/landing/FeaturesSection.tsx
export default function FeaturesSection() {
  const features = [
    { title: 'MARKET PULSE', desc: 'Real-time structural monitoring of essential availability.' },
    { title: 'STORE RATE AUDIT', desc: 'Pre-emptive verification of internal exchange rates.' },
    { title: 'POWER STABILITY', desc: 'Citizen-led logging of cold-chain reliability and generator health.' },
    { title: 'DEPTH LOGISTICS', desc: 'Wait-time and car-count monitoring for high-demand stations.' },
    { title: 'SPATIAL DEPTH', desc: 'High-precision coordinate mapping of regional cost-floors.' },
    { title: 'VERIFIED TRUST', desc: 'Receipt-backed authority scoring for system contributors.' }
  ];

  return (
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
          {features.map((f, i) => (
            <div key={i} className="card p-12 hover:border-primary group">
              <div className="flex justify-between items-start mb-12">
                <span className="text-mono-data text-primary text-xs">M_{String(i+1).padStart(2, '0')}</span>
                <span className="material-symbols-outlined text-text-muted group-hover:text-primary" style={{ fontSize: '20px' }}>settings_accessibility</span>
              </div>
              <h4 className="font-serif text-2xl text-text-main mb-4 uppercase">{f.title}</h4>
              <p className="text-text-muted text-sm font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}