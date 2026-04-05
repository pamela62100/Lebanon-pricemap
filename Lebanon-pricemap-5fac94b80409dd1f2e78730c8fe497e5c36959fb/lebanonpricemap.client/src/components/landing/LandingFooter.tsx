export default function LandingFooter() {
  return (
    <footer className="py-8 border-t border-border-primary bg-white px-4 sm:px-6 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-[9px] font-black">WA</span>
          </div>
          <span className="font-semibold text-sm text-text-main">WenArkhass</span>
        </div>

        <p className="text-xs text-text-muted text-center">
          Real-time prices and store availability across Lebanon.
        </p>

        <div className="flex gap-5">
          {['Home', 'About', 'Support'].map((link) => (
            <button
              key={link}
              type="button"
              className="text-xs font-medium text-text-muted hover:text-text-main transition-colors"
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
