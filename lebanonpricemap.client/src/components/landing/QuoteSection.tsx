export default function QuoteSection() {
  return (
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

        <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-text-muted">
          Citizens Intelligence Network
        </p>

      </div>

    </section>
  );
}