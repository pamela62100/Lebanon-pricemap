import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PRODUCTS, getEnrichedPriceEntries } from '@/api/mockData';
import { PriceResultCard } from '@/components/cards/PriceResultCard';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';

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
    <div className="max-w-xl mx-auto px-5 py-12 md:py-20 animate-page">
      <AnimatePresence mode="wait">

        {/* ── PHASE 1: Scanner ── */}
        {phase === 'scanner' && (
          <motion.div key="scanner" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col gap-12">
            <header>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">Signal_Acquisition</p>
              <h1 className="text-5xl md:text-6xl font-bold text-text-main tracking-tighter leading-none">Signal Scan.</h1>
              <p className="text-sm font-medium text-text-muted mt-4 opacity-60">Align the optical sensor with the product code for instant market decryption.</p>
            </header>

            {/* Viewfinder System */}
            <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden bg-black shadow-2xl border-[12px] border-bg-muted">
              {/* Corner Brackets */}
              <div className="absolute inset-12 pointer-events-none">
                 {[
                   'top-0 left-0 border-t-4 border-l-4',
                   'top-0 right-0 border-t-4 border-r-4',
                   'bottom-0 left-0 border-b-4 border-l-4',
                   'bottom-0 right-0 border-b-4 border-r-4',
                 ].map((cls, i) => (
                   <div key={i} className={cn("absolute w-12 h-12 rounded-sm", cls)} style={{ borderColor: 'var(--primary)' }} />
                 ))}
              </div>

              {/* Laser Sweep */}
              <motion.div
                className="absolute left-8 right-8 h-1 z-10"
                style={{
                  background: 'linear-gradient(to right, transparent, var(--primary), transparent)',
                  boxShadow: '0 0 20px var(--primary)',
                }}
                animate={{ top: ['20%', '80%', '20%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                 <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-center">Manual_Override</p>
                 <div className="flex gap-3">
                    <input
                      type="text"
                      value={manualInput}
                      onChange={e => setManualInput(e.target.value)}
                      placeholder="6221012345001"
                      className="flex-1 h-14 bg-bg-muted border-none rounded-2xl px-6 text-sm font-data font-bold text-text-main focus:ring-2 focus:ring-primary/20 transition-all"
                      onKeyDown={e => e.key === 'Enter' && manualInput && handleScan(manualInput)}
                    />
                    <button
                      onClick={() => manualInput && handleScan(manualInput)}
                      className="h-14 px-8 bg-text-main text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-xl">target</span>
                      Acquire
                    </button>
                 </div>
              </div>

              <button
                onClick={() => handleScan('6221012345001')}
                className="w-full py-4 rounded-2xl bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest hover:bg-primary/10 transition-all"
              >
                Calibration: Whole Milk TL 1L
              </button>
            </div>
          </motion.div>
        )}

        {/* ── PHASE 2: Result ── */}
        {phase === 'result' && foundProduct && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="flex flex-col gap-10">
            <header className="flex flex-col gap-8">
              <button
                onClick={reset}
                className="flex items-center gap-2 text-[10px] font-bold text-text-muted hover:text-text-main uppercase tracking-[0.2em] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                Reset Sensor
              </button>
              
              <div className="p-8 rounded-[2rem] bg-text-main text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-text-main/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <span className="material-symbols-outlined text-8xl">verified</span>
                </div>
                <div className="w-20 h-20 rounded-[1.5rem] bg-white text-text-main flex items-center justify-center shrink-0 border border-white/10 shadow-xl">
                  <span className="material-symbols-outlined text-4xl">inventory_2</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-2">Target_Identified</p>
                  <h2 className="text-3xl font-bold tracking-tight truncate">{foundProduct.name}</h2>
                  <p className="text-sm text-white/60 font-medium">{foundProduct.unit} · {foundProduct.nameAr}</p>
                </div>
              </div>
            </header>

            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Market_Comparisons</h3>
                  <button
                    onClick={() => {
                      addItem(foundProduct.id);
                      addToast(`${foundProduct.name} added to cart`, 'success');
                    }}
                    className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
                  >
                    Post_to_Inventory
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  </button>
               </div>

               <div className="space-y-4">
                 {priceEntries.map((entry, idx) => (
                   <div key={entry.id} className="relative group">
                     {idx === 0 && (
                       <div className="absolute -top-3 right-6 z-10 px-3 py-1 bg-green-500 text-white text-[8px] font-bold uppercase tracking-widest rounded-lg shadow-lg border-2 border-white">
                         Optimal_Source
                       </div>
                     )}
                     <PriceResultCard entry={entry} index={idx} />
                   </div>
                 ))}
                 {priceEntries.length === 0 && (
                   <EmptyState 
                    icon="search_off" 
                    title="Zero Intel" 
                    subtitle="No verified price signals found for this product code in the current market cycle."
                   />
                 )}
               </div>
            </div>
          </motion.div>
        )}

        {/* ── PHASE 3: Not Found ── */}
        {phase === 'not_found' && (
          <motion.div key="notfound" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center py-20 grayscale">
            <div className="w-24 h-24 rounded-[2rem] bg-bg-muted flex items-center justify-center text-text-muted mb-8 border border-border-soft">
              <span className="material-symbols-outlined text-4xl">barcode_reader</span>
            </div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">Signal_Null</p>
            <h2 className="text-4xl font-bold text-text-main tracking-tighter mb-4">Unknown Identity.</h2>
            <p className="text-sm text-text-muted opacity-60 max-w-xs leading-relaxed mb-12">
              This product code is not yet registered in the Wein decentralized database.
            </p>
            
            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={() => setPhase('scanner')}
                className="btn-primary w-full h-14 rounded-2xl"
              >
                Re-initialize Scanner
              </button>
              <button className="w-full h-14 rounded-2xl border border-border-soft text-[10px] font-bold text-text-muted uppercase tracking-widest hover:bg-bg-muted transition-all">
                Submit Signal for Review
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
