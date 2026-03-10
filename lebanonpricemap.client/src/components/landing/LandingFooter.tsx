export default function LandingFooter() {
  const links = ['Home', 'About', 'Support'];

  return (
    <footer className="py-12 border-t border-border-primary bg-bg-surface px-4 sm:px-6 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white text-[10px] font-black">WA</span>
          </div>

          <span
            className="font-display text-lg text-text-main tracking-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            WenArkhass
          </span>
        </div>

        <div className="text-xs text-text-muted text-center">
          Real-time prices and store availability across Lebanon.
        </div>

        <div className="flex gap-4 sm:gap-6">
          {links.map((link) => (
            <button
              key={link}
              type="button"
              className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}