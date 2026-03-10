export default function LogicSection() {
  return (
    <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 md:px-10 lg:px-16 border-b border-border-primary/10 bg-bg-base">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <span className="text-primary font-black text-[11px] tracking-[0.25em] uppercase mb-5 block">
            How it works
          </span>

          <h2 className="text-4xl sm:text-5xl font-black text-text-main leading-tight mb-6">
            Smarter shopping starts before you leave home.
          </h2>

          <p className="text-base sm:text-lg text-text-sub font-medium leading-relaxed max-w-xl mb-8">
            WenArkhass helps people in Lebanon compare live prices, check product
            availability, and understand store conditions before making a trip.
            That means less wasted time, less fuel, and better buying decisions.
          </p>

          <div className="grid grid-cols-2 gap-6 border-t border-border-primary/10 pt-8">
            <div>
              <p className="text-3xl sm:text-4xl text-text-main font-black mb-2">Live</p>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Price updates
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl text-text-main font-black mb-2">Trusted</p>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Community reports
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 sm:p-8 shadow-glass">
          <div className="bg-white border border-border-primary rounded-3xl p-6 sm:p-8 min-h-[320px] flex flex-col justify-between">
            <div className="flex justify-between items-center mb-10">
              <span className="text-sm font-bold text-text-muted">Live store insights</span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-bg-muted h-12" />
              <div className="rounded-2xl bg-bg-muted h-12 w-5/6" />
              <div className="rounded-2xl bg-bg-muted h-12 w-4/6" />
            </div>

            <div className="mt-10">
              <p className="text-sm text-primary font-bold">
                Prices, stock status, and store conditions in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}