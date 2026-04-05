import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PriceResultCard } from '@/components/cards/PriceResultCard';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { productsApi } from '@/api/products.api';
import { pricesApi } from '@/api/prices.api';
import { feedbackApi } from '@/api/feedback.api';
import type { Product } from '@/types';

type ScanPhase = 'scanner' | 'result' | 'not_found' | 'submitted';

export function BarcodeScannerPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<ScanPhase>('scanner');
  const [manualInput, setManualInput] = useState('');
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [priceEntries, setPriceEntries] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);

  const handleScan = async (barcode: string) => {
    if (!barcode.trim() || isSearching) return;
    setIsSearching(true);
    try {
      const res = await productsApi.getByBarcode(barcode.trim());
      const product: Product = res.data?.data ?? res.data;
      if (!product?.id) {
        setPhase('not_found');
        return;
      }

      const priceRes = await pricesApi.getByProduct(product.id);
      const data = priceRes.data?.data ?? priceRes.data;
      const entries = (Array.isArray(data) ? data : [])
        .filter((e: any) => e.status === 'verified')
        .sort((a: any, b: any) => a.priceLbp - b.priceLbp);

      setFoundProduct(product);
      setPriceEntries(entries);

      if (navigator.vibrate) navigator.vibrate(200);
      setPhase('result');
    } catch {
      setPhase('not_found');
    } finally {
      setIsSearching(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setPhase('scanner');
    setManualInput('');
    setFoundProduct(null);
    setPriceEntries([]);
  };

  const handleSubmitForReview = async () => {
    setIsSubmitting(true);
    try {
      await feedbackApi.submit({
        priceEntryId: 'barcode-review',
        type: 'missing_barcode',
        note: `Barcode not found: ${manualInput}`,
      });
    } catch {
      // Best-effort — show success regardless
    } finally {
      setIsSubmitting(false);
      setPhase('submitted');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-8 py-8 animate-page">
      {/* Desktop: scanner not available */}
      <div className="hidden lg:flex flex-col items-center justify-center py-24 text-center gap-4">
        <span className="material-symbols-outlined text-5xl text-text-muted/30">smartphone</span>
        <h2 className="text-lg font-bold text-text-main">Open on your phone</h2>
        <p className="text-sm text-text-muted max-w-xs">
          Barcode scanning requires a camera. Open WenArkhass on your mobile device to use this feature.
        </p>
      </div>
      <div className="lg:hidden">
      <AnimatePresence mode="wait">
        {phase === 'scanner' && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-12"
          >
            <header>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">
                Barcode scanner
              </p>
              <h1 className="text-5xl md:text-6xl font-bold text-text-main tracking-tighter leading-none">
                Scan a product.
              </h1>
              <p className="text-sm font-medium text-text-muted mt-4 opacity-60">
                Scan a barcode or enter it manually to compare prices instantly.
              </p>
            </header>

            <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden bg-black shadow-2xl border-[12px] border-bg-muted">
              <div className="absolute inset-12 pointer-events-none">
                {[
                  'top-0 left-0 border-t-4 border-l-4',
                  'top-0 right-0 border-t-4 border-r-4',
                  'bottom-0 left-0 border-b-4 border-l-4',
                  'bottom-0 right-0 border-b-4 border-r-4',
                ].map((classes, index) => (
                  <div
                    key={index}
                    className={cn('absolute w-12 h-12 rounded-sm', classes)}
                    style={{ borderColor: 'var(--primary)' }}
                  />
                ))}
              </div>

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
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-center">
                  Enter barcode manually
                </p>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(event) => setManualInput(event.target.value)}
                    placeholder="6221012345001"
                    className="flex-1 h-14 bg-bg-muted border-none rounded-2xl px-6 text-sm font-data font-bold text-text-main focus:ring-2 focus:ring-primary/20 transition-all"
                    onKeyDown={(event) => event.key === 'Enter' && manualInput && handleScan(manualInput)}
                  />

                  <button
                    onClick={() => manualInput && handleScan(manualInput)}
                    disabled={isSearching}
                    className="h-14 px-8 bg-primary text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-xl">search</span>
                    {isSearching ? 'Searching…' : 'Search'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'result' && foundProduct && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col gap-10"
          >
            <header className="flex flex-col gap-8">
              <button
                onClick={reset}
                className="flex items-center gap-2 text-[10px] font-bold text-text-muted hover:text-text-main uppercase tracking-[0.2em] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                Scan another product
              </button>

              <div className="p-8 rounded-[2rem] bg-text-main text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-text-main/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <span className="material-symbols-outlined text-8xl">verified</span>
                </div>

                <div className="w-20 h-20 rounded-[1.5rem] bg-white text-text-main flex items-center justify-center shrink-0 border border-white/10 shadow-xl">
                  <span className="material-symbols-outlined text-4xl">inventory_2</span>
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-2">
                    Product found
                  </p>
                  <h2 className="text-3xl font-bold tracking-tight truncate">{foundProduct.name}</h2>
                  <p className="text-sm text-white/60 font-medium">
                    {foundProduct.unit} · {foundProduct.nameAr}
                  </p>
                </div>

                <div className="md:ml-auto">
                   <button 
                     onClick={() => navigate(`/app/product/${foundProduct.id}`)}
                     className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-white transition-all"
                   >
                     View product page
                   </button>
                </div>
              </div>
            </header>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                  Price comparison
                </h3>

                <button
                  onClick={() => {
                    addItem(foundProduct.id);
                    addToast(`${foundProduct.name} added to list`, 'success');
                  }}
                  className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
                >
                  Add to cart
                  <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                </button>
              </div>

              <div className="space-y-4">
                {priceEntries.map((entry, index) => (
                  <div key={entry.id} className="relative group">
                    {index === 0 && (
                      <div className="absolute -top-3 right-6 z-10 px-3 py-1 bg-green-500 text-white text-[8px] font-bold uppercase tracking-widest rounded-lg shadow-lg border-2 border-white">
                        Best price
                      </div>
                    )}
                    <PriceResultCard entry={entry} index={index} />
                  </div>
                ))}

                {priceEntries.length === 0 && (
                  <EmptyState
                    icon="search_off"
                    title="No verified prices found"
                    subtitle="We could not find verified price entries for this product yet."
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'not_found' && (
          <motion.div
            key="notfound"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center py-20 grayscale"
          >
            <div className="w-24 h-24 rounded-[2rem] bg-bg-muted flex items-center justify-center text-text-muted mb-8 border border-border-soft">
              <span className="material-symbols-outlined text-4xl">barcode_reader</span>
            </div>

            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4">
              Product not found
            </p>
            <h2 className="text-4xl font-bold text-text-main tracking-tighter mb-4">
              We don't know this barcode yet.
            </h2>
            <p className="text-sm text-text-muted opacity-60 max-w-xs leading-relaxed mb-12">
              This barcode is not yet registered in the WenArkhass product database.
            </p>

            <div className="flex flex-col gap-3 w-full">
              <button onClick={() => setPhase('scanner')} className="btn-primary w-full h-14 rounded-2xl">
                Scan Again
              </button>

              <button
                onClick={handleSubmitForReview}
                disabled={isSubmitting}
                className="w-full h-14 rounded-2xl border border-border-soft text-[10px] font-bold text-text-muted uppercase tracking-widest hover:bg-bg-muted transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting…' : 'Submit for review'}
              </button>
            </div>
          </motion.div>
        )}
        {phase === 'submitted' && (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center py-20 gap-6"
          >
            <div className="w-20 h-20 rounded-[2rem] bg-green-50 border border-green-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-3">Submitted</p>
              <h2 className="text-3xl font-bold text-text-main tracking-tighter mb-3">Thanks for the report.</h2>
              <p className="text-sm text-text-muted opacity-60 max-w-xs leading-relaxed">
                We'll review this barcode and add it to the database as soon as possible.
              </p>
            </div>
            <button onClick={reset} className="btn-primary h-12 px-8 rounded-2xl">
              Scan another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>{/* end lg:hidden */}
    </div>
  );
}
