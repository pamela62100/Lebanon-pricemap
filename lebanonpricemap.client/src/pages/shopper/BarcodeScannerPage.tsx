import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PRODUCTS, getEnrichedPriceEntries } from '@/api/mockData';
import { PriceResultCard } from '@/components/cards/PriceResultCard';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';

type ScanPhase = 'scanner' | 'result' | 'not_found';

export function BarcodeScannerPage() {
  const [phase, setPhase] = useState<ScanPhase>('scanner');
  const [manualInput, setManualInput] = useState('');
  const [foundProduct, setFoundProduct] = useState<any>(null);
  const [priceEntries, setPriceEntries] = useState<any[]>([]);
  const addItem = useCartStore(s => s.addItem);
  const addToast = useToastStore(s => s.addToast);

  const handleScan = (barcode: string) => {
    const product = MOCK_PRODUCTS.find(p => (p as any).barcode === barcode);
    if (product) {
      const entries = getEnrichedPriceEntries()
        .filter(e => e.productId === product.id && e.status === 'verified')
        .sort((a, b) => a.priceLbp - b.priceLbp);
      setFoundProduct(product);
      setPriceEntries(entries);
      // Haptic feedback — gives native "found it" feel on mobile
      if (navigator.vibrate) navigator.vibrate(200);
      setPhase('result');
    } else {
      setPhase('not_found');
    }
  };

  const reset = () => {
    setPhase('scanner');
    setManualInput('');
    setFoundProduct(null);
    setPriceEntries([]);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <AnimatePresence mode="wait">

        {/* ── PHASE 1: Scanner ── */}
        {phase === 'scanner' && (
          <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-2xl font-bold text-text-main mb-2">Scan Barcode</h1>
            <p className="text-text-muted text-sm mb-8">
              Point camera at a product barcode to compare prices instantly
            </p>

            {/* Viewfinder */}
            <div className="relative w-full aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden bg-black mb-6">
              {/* Corner brackets */}
              {[
                'top-4 left-4 border-t-[3px] border-l-[3px]',
                'top-4 right-4 border-t-[3px] border-r-[3px]',
                'bottom-4 left-4 border-b-[3px] border-l-[3px]',
                'bottom-4 right-4 border-b-[3px] border-r-[3px]',
              ].map((cls, i) => (
                <div
                  key={i}
                  className={`absolute ${cls} w-8 h-8`}
                  style={{ borderColor: 'var(--primary)' }}
                />
              ))}

              {/* Animated scan line */}
              <motion.div
                className="absolute left-6 right-6 h-0.5"
                style={{
                  background: 'var(--primary)',
                  boxShadow: '0 0 10px var(--primary)',
                }}
                animate={{ top: ['20%', '80%', '20%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white/30 text-sm">Camera preview</p>
              </div>
            </div>

            <p className="text-center text-sm text-text-muted mb-3">
              Or enter barcode manually
            </p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                placeholder="6221012345001"
                className="flex-1 h-12 bg-bg-muted border border-border-soft rounded-xl px-4 text-sm font-mono focus:border-primary focus:outline-none focus:shadow-[0_0_0_3px_var(--primary-soft)]"
                onKeyDown={e => e.key === 'Enter' && manualInput && handleScan(manualInput)}
              />
              <button
                onClick={() => manualInput && handleScan(manualInput)}
                className="h-12 px-5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </div>

            <button
              onClick={() => handleScan('6221012345001')}
              className="w-full h-12 border border-border-soft rounded-xl text-sm font-semibold text-text-sub hover:bg-bg-muted transition-colors"
            >
              🎯 Try Demo Scan — Whole Milk TL 1L
            </button>
          </motion.div>
        )}

        {/* ── PHASE 2: Result ── */}
        {phase === 'result' && foundProduct && (
          <motion.div key="result" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <button
              onClick={reset}
              className="flex items-center gap-1 text-text-muted text-sm mb-6 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
              Scan another
            </button>

            <div className="p-5 bg-bg-surface border border-border-soft rounded-2xl mb-6">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Product Found</p>
              <h2 className="text-xl font-bold text-text-main">{foundProduct.name}</h2>
              <p className="text-sm text-text-muted">{foundProduct.nameAr} · {foundProduct.unit}</p>
              <button
                onClick={() => {
                  addItem(foundProduct.id);
                  addToast(`${foundProduct.name} added to cart`, 'success');
                }}
                className="mt-3 h-9 px-4 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary/20 transition-colors"
              >
                + Add to Cart
              </button>
            </div>

            <h3 className="font-bold text-text-main mb-4">
              All Prices
              <span className="ml-2 text-xs font-normal text-text-muted">cheapest first</span>
            </h3>

            <div className="flex flex-col gap-3">
              {priceEntries.map((entry, idx) => (
                <div key={entry.id} className="relative">
                  {idx === 0 && (
                    <span className="absolute -top-2 -right-2 z-10 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      ✓ Best Price
                    </span>
                  )}
                  <PriceResultCard entry={entry} index={idx} />
                </div>
              ))}
              {priceEntries.length === 0 && (
                <p className="text-center text-text-muted py-8 text-sm">
                  No verified prices found for this product yet.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* ── PHASE 3: Not Found ── */}
        {phase === 'not_found' && (
          <motion.div
            key="notfound"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <span className="text-6xl">🔍</span>
            <h2 className="text-xl font-bold text-text-main mt-4 mb-2">Product Not Found</h2>
            <p className="text-text-muted text-sm mb-8">
              This barcode isn't in our database yet. Be the first to add it!
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="/app/upload"
                className="w-full h-12 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center"
              >
                📷 Upload a Receipt to Add It
              </a>
              <button
                onClick={reset}
                className="w-full h-12 bg-primary text-white rounded-xl font-bold shadow-lg"
              >
                Try Another Product
              </button>
              <button className="w-full h-12 border border-border-soft rounded-xl text-text-main font-semibold text-sm">
                Submit Missing Product Info
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
