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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, ease: 'easeOut' }}
      className={cn(
        'bg-white border border-border-soft rounded-2xl p-5 flex flex-col shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-text-main/15',
        !product.isInStock && 'opacity-60'
      )}
    >
      {/* Status badges row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold',
            product.isInStock
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          )}
        >
          <span className={cn('w-1.5 h-1.5 rounded-full', product.isInStock ? 'bg-green-500' : 'bg-red-400')} />
          {product.isInStock ? 'In stock' : 'Unavailable'}
        </span>

        {product.isPromotion && !promoExpired && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[11px]">local_offer</span>
            Sale
          </span>
        )}

        {stale && (
          <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-[11px] font-semibold">
            Needs review
          </span>
        )}
      </div>

      {/* Product identity */}
      <div className="flex items-start gap-3 mb-auto">
        <div className="w-12 h-12 rounded-xl bg-bg-muted flex items-center justify-center text-text-muted shrink-0">
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-text-main leading-snug mb-0.5 line-clamp-2">
            {product.productName}
          </h3>
          <p className="text-xs text-text-muted">
            {product.productCategory} · {product.productUnit}
          </p>
        </div>
      </div>

      {/* Price + action */}
      <div className="mt-4 pt-4 border-t border-border-soft flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide mb-1">
            Official price
          </p>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl font-bold text-text-main font-data tracking-tight">
              {effectivePrice.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-text-muted">LBP</span>
          </div>

          {product.isPromotion && product.promoPriceLbp && !promoExpired && (
            <p className="text-xs text-text-muted/50 line-through mt-0.5">
              {product.officialPriceLbp.toLocaleString()} LBP
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onReport(product)}
          className="w-9 h-9 rounded-full bg-bg-muted flex items-center justify-center text-text-muted hover:bg-red-500 hover:text-white transition-all shrink-0"
          title="Report a discrepancy"
        >
          <span className="material-symbols-outlined text-[18px]">flag</span>
        </button>
      </div>

      <p className="mt-3 text-[10px] text-text-muted/60">
        Updated {timeAgo(product.lastUpdatedAt)}
      </p>
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
      new Set(products.map((p) => p.productCategory))
    );
    return ['All', ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter((p) => p.productCategory === activeCategory);
  }, [products, activeCategory]);

  const inStockCount = products.filter((p) => p.isInStock).length;

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
        subtitle="This store hasn't published any products to its official catalog yet."
      />
    );
  }

  return (
    <div className="space-y-7">
      {/* Header: title + filters */}
      <div className="flex flex-col gap-4">
        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-text-main tracking-tight">
              Official catalog
            </h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live inventory
              </span>
              <span className="text-sm text-text-muted">
                {inStockCount} of {products.length} items in stock
              </span>
            </div>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border whitespace-nowrap shrink-0',
                activeCategory === category
                  ? 'bg-text-main text-white border-text-main shadow-sm'
                  : 'bg-white text-text-muted border-border-soft hover:border-text-main/30 hover:text-text-main'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProducts.map((product, index) => (
          <CatalogProductCard
            key={product.id}
            product={product}
            index={index}
            onReport={setReportTarget}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-16 text-center">
          <span className="material-symbols-outlined text-4xl text-text-muted/20 mb-3 block">
            search_off
          </span>
          <p className="text-sm text-text-muted">No items in this category right now.</p>
        </div>
      )}

      {reportTarget && (
        <CatalogDiscrepancyDialog
          product={reportTarget}
          storeId={storeId}
          isOpen={!!reportTarget}
          onClose={() => setReportTarget(null)}
          onSubmitted={() => {
            addToast('Thanks. Your report was submitted.');
          }}
        />
      )}
    </div>
  );
}