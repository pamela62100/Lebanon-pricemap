// src/components/landing/LogicSection.tsx
export default function LogicSection() {
  return (
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
  );
}