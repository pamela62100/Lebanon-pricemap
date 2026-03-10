import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { catalogApi } from '@/api/catalog.api';
import { CatalogDiscrepancyDialog } from '@/components/dialogs/CatalogDiscrepancyDialog';
import type { CatalogProduct } from '@/types/catalog.types';
import { cn, timeAgo } from '@/lib/utils';
import { useToastStore } from '@/store/useToastStore';
import { EmptyState } from '@/components/ui/EmptyState';

interface StoreCatalogViewProps {
  storeId: string;
  storeName: string;
  isVerified: boolean;
}

const DAYS_STALE = 3;

function isStale(lastUpdatedAt: string): boolean {
  const daysSince =
    (Date.now() - new Date(lastUpdatedAt).getTime()) / (1000 * 60 * 60 * 24);
  return daysSince > DAYS_STALE;
}

const CATEGORY_ICONS: Record<string, string> = {
  Dairy: 'water_drop',
  Bakery: 'bakery_dining',
  Oil: 'opacity',
  Meat: 'kebab_dining',
  Grains: 'grain',
  Produce: 'nutrition',
  Fuel: 'local_gas_station',
  Beverages: 'local_drink',
};

function CatalogProductCard({
  product,
  index,
  onReport,
}: {
  product: CatalogProduct;
  index: number;
  onReport: (product: CatalogProduct) => void;
}) {
  const effectivePrice =
    product.isPromotion && product.promoPriceLbp
      ? product.promoPriceLbp
      : product.officialPriceLbp;

  const stale = isStale(product.lastUpdatedAt);
  const promoExpired =
    product.isPromotion &&
    product.promoEndsAt &&
    new Date(product.promoEndsAt) < new Date();

  const icon = CATEGORY_ICONS[product.productCategory] || 'inventory_2';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        'bg-white border border-border-soft rounded-[28px] p-5 sm:p-6 flex flex-col shadow-sm transition-all hover:shadow-md hover:border-text-main/10',
        !product.isInStock && 'opacity-70'
      )}
    >
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <div
          className={cn(
            'px-3 py-1 rounded-full text-xs font-semibold',
            product.isInStock
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'
          )}
        >
          {product.isInStock ? 'In stock' : 'Unavailable'}
        </div>

        {product.isPromotion && !promoExpired ? (
          <div className="px-3 py-1 rounded-full bg-text-main/8 text-text-main text-xs font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">local_offer</span>
            Promotion
          </div>
        ) : null}

        {stale ? (
          <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
            Needs review
          </div>
        ) : null}
      </div>

      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-bg-muted flex items-center justify-center text-text-muted shrink-0">
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>

        <div className="min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-text-main leading-tight mb-1 truncate">
            {product.productName}
          </h3>
          <p className="text-sm text-text-muted">
            {product.productCategory} • {product.productUnit}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-5 border-t border-border-soft flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-text-muted mb-1">Official price</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl sm:text-4xl font-bold text-text-main font-data tracking-tight">
              {effectivePrice.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-text-muted">LBP</span>
          </div>

          {product.isPromotion && product.promoPriceLbp && !promoExpired ? (
            <span className="text-sm text-text-muted/50 line-through">
              LBP {product.officialPriceLbp.toLocaleString()}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => onReport(product)}
          className="w-11 h-11 rounded-full bg-bg-muted flex items-center justify-center text-text-muted hover:bg-red-500 hover:text-white transition-all shrink-0"
          title="Report a problem"
        >
          <span className="material-symbols-outlined text-xl">flag</span>
        </button>
      </div>

      <p className="mt-4 text-xs text-text-muted">Updated {timeAgo(product.lastUpdatedAt)}</p>
    </motion.div>
  );
}

export function StoreCatalogView({
  storeId,
  storeName,
  isVerified,
}: StoreCatalogViewProps) {
  const addToast = useToastStore((state) => state.addToast);
  const [reportTarget, setReportTarget] = useState<CatalogProduct | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const products = useMemo(() => catalogApi.getByStore(storeId), [storeId]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.productCategory))
    );
    return ['All', ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter((product) => product.productCategory === activeCategory);
  }, [products, activeCategory]);

  const inStockCount = products.filter((product) => product.isInStock).length;

  if (!isVerified) {
    return (
      <EmptyState
        icon="storefront"
        title="Catalog not available"
        subtitle={`${storeName} is not an official partner yet. Use the main search to see community-submitted prices instead.`}
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon="inventory_2"
        title="No catalog items yet"
        subtitle="This store has not published products in its official catalog yet."
      />
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-main tracking-tight mb-2">
            Official catalog
          </h2>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Live inventory
            </div>

            <p className="text-sm text-text-muted">
              {inStockCount} of {products.length} items currently available
            </p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-semibold transition-all border whitespace-nowrap',
                activeCategory === category
                  ? 'bg-text-main text-white border-text-main'
                  : 'bg-white text-text-main border-border-soft hover:border-text-main/20'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {filteredProducts.map((product, index) => (
          <CatalogProductCard
            key={product.id}
            product={product}
            index={index}
            onReport={setReportTarget}
          />
        ))}
      </div>

      {reportTarget ? (
        <CatalogDiscrepancyDialog
          product={reportTarget}
          storeId={storeId}
          isOpen={!!reportTarget}
          onClose={() => setReportTarget(null)}
          onSubmitted={() => {
            addToast('Thanks. Your report was submitted.');
          }}
        />
      ) : null}
    </div>
  );
}