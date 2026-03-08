import { motion } from 'framer-motion';
import type { OptimizerResult } from './StoreOptimizer';

interface CartSummaryProps {
  result: OptimizerResult;
  cartLength: number;
  onViewOptimize: () => void;
}

export function CartSummary({ result, cartLength, onViewOptimize }: CartSummaryProps) {
  const { singleBest, splitStrategy } = result;

  if (cartLength === 0) {
    return (
      <div className="p-6 rounded-2xl bg-bg-surface border border-border-soft text-center">
        <span className="material-symbols-outlined text-text-muted mb-2" style={{ fontSize: '36px' }}>shopping_cart</span>
        <p className="text-sm text-text-muted">Add products to see price optimization</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Single best store */}
      {singleBest && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-bg-surface border border-border-soft"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wide mb-1">Best single store</p>
              <p className="text-base font-bold text-text-main">{singleBest.storeName}</p>
              <p className="text-xs text-text-muted">{singleBest.district} · {singleBest.coverageCount}/{cartLength} items</p>
            </div>
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>storefront</span>
          </div>
          <p className="text-2xl font-black text-primary">LBP {singleBest.totalLbp.toLocaleString()}</p>
        </motion.div>
      )}

      {/* Split strategy */}
      {splitStrategy && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-primary/5 border border-primary/20"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1">
                Split trip — saves LBP {splitStrategy.savings.toLocaleString()}
              </p>
              <p className="text-sm text-text-main">
                {splitStrategy.stores.map(s => s.storeName).join(' + ')}
              </p>
            </div>
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>route</span>
          </div>
          <p className="text-2xl font-black text-primary">LBP {splitStrategy.totalLbp.toLocaleString()}</p>
          <p className="text-xs text-text-muted mt-1">across {splitStrategy.stores.length} stores</p>
        </motion.div>
      )}

      {/* View full breakdown */}
      <button
        onClick={onViewOptimize}
        className="w-full h-11 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-all"
      >
        View full price breakdown →
      </button>
    </div>
  );
}
