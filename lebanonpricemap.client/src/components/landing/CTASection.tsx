// src/components/landing/CTASection.tsx
import { useNavigate } from 'react-router-dom';

export default function CTASection() {
  const navigate = useNavigate();

  return (
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
  );
}