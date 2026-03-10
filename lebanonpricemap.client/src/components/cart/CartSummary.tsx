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
      <div className="p-6 rounded-[28px] bg-white border border-border-soft text-center shadow-sm">
        <span className="material-symbols-outlined text-text-muted mb-2 text-[36px]">
          shopping_cart
        </span>
        <p className="text-sm sm:text-base text-text-muted">
          Add products to see the best price options.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {singleBest ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 sm:p-6 rounded-[28px] bg-white border border-border-soft shadow-sm"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-text-muted mb-1">Best single store</p>
              <p className="text-lg sm:text-xl font-bold text-text-main">{singleBest.storeName}</p>
              <p className="text-sm text-text-muted">
                {singleBest.district} • {singleBest.coverageCount}/{cartLength} items
              </p>
            </div>

            <span className="material-symbols-outlined text-primary text-[24px]">
              storefront
            </span>
          </div>

          <p className="text-2xl sm:text-3xl font-black text-primary">
            LBP {singleBest.totalLbp.toLocaleString()}
          </p>
        </motion.div>
      ) : null}

      {splitStrategy ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 sm:p-6 rounded-[28px] bg-primary/5 border border-primary/20"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-primary mb-1">
                Split shopping trip
              </p>
              <p className="text-sm sm:text-base text-text-main font-semibold leading-relaxed">
                Save LBP {splitStrategy.savings.toLocaleString()} by shopping at{' '}
                {splitStrategy.stores.map((store) => store.storeName).join(' + ')}.
              </p>
            </div>

            <span className="material-symbols-outlined text-primary text-[24px]">route</span>
          </div>

          <p className="text-2xl sm:text-3xl font-black text-primary">
            LBP {splitStrategy.totalLbp.toLocaleString()}
          </p>
          <p className="text-sm text-text-muted mt-1">
            Across {splitStrategy.stores.length} stores
          </p>
        </motion.div>
      ) : null}

      <button
        type="button"
        onClick={onViewOptimize}
        className="w-full h-12 sm:h-13 rounded-full bg-primary text-white font-semibold text-sm sm:text-base hover:opacity-90 transition-all"
      >
        View full price breakdown
      </button>
    </div>
  );
}