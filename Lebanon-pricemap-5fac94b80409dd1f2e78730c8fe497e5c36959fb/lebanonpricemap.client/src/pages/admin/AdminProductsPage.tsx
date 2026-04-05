import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productsApi } from '@/api/products.api';
import { useRouteDialog } from '@/hooks/useRouteDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { RouteDialog } from '@/components/dialogs/RouteDialog';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

const CATEGORIES = ['All', 'Dairy', 'Oil', 'Grains', 'Fuel', 'Produce'];

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { open, getParam } = useRouteDialog();

  const activeProductId = getParam('id');
  const activeProduct = products.find(p => p.id === activeProductId);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    setEditName(activeProduct?.name ?? '');
  }, [activeProduct]);

  useEffect(() => {
    productsApi.getAll({ search, category: selectedCategory === 'All' ? undefined : selectedCategory }).then((res) => {
      const data = res.data?.data ?? res.data;
      setProducts(Array.isArray(data) ? data : []);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, [search, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    CATEGORIES.slice(1).forEach(cat => {
      counts[cat] = products.filter(p => p.category === cat).length;
    });
    return counts;
  }, [products]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      <h1 className="text-2xl font-bold text-text-main mb-6">Product Management</h1>

      <div className="grid grid-cols-4 gap-6">
        {/* Category sidebar */}
        <div className="bg-bg-surface border border-border-soft rounded-xl p-4">
          <h3 className="text-sm font-bold text-text-main mb-4">Categories</h3>
          <div className="flex flex-col gap-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  selectedCategory === cat
                    ? 'bg-primary-soft text-primary font-semibold'
                    : 'text-text-sub hover:bg-bg-muted'
                )}
              >
                {cat}
                <span className="ml-auto text-xs text-text-muted float-right mt-0.5">
                  {categoryCounts[cat] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Product list */}
        <div className="col-span-3">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-bg-surface border border-border-soft rounded-xl px-4 h-10 flex-1">
              <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '18px' }}>search</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="bg-transparent border-none outline-none text-sm text-text-main placeholder:text-text-muted flex-1" />
            </div>
            <button className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:bg-primary-hover">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              Add Product
            </button>
          </div>

          <div className="bg-bg-surface border border-border-soft rounded-xl overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-12 rounded-xl bg-bg-muted animate-pulse" />)}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-soft">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Product</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Arabic</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Category</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Unit</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-sm text-text-muted">No products found.</td>
                    </tr>
                  ) : products.map(product => (
                    <tr key={product.id} className="border-b border-bg-muted hover:bg-primary-soft/40 transition-colors">
                      <td className="py-4 px-4">
                        <p className="text-sm font-semibold text-text-main">{product.name}</p>
                        <p className="text-xs text-text-muted">{product.aliases?.join(', ')}</p>
                      </td>
                      <td className="py-4 px-4 text-sm text-text-sub" dir="rtl">{product.nameAr}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-soft text-primary">{product.category}</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-text-sub">{product.unit}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => open('edit-product', { id: product.id })}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-bg-muted text-text-sub hover:bg-border-soft"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                          </button>
                          <button
                            onClick={() => open('archive-product', { id: product.id })}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--status-flagged-bg)] text-[var(--status-flagged-text)] hover:opacity-80"
                            title="Archive"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>archive</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <RouteDialog dialogId="edit-product" title="Edit Product" description="Update core product information.">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5 block">Product Name</label>
            <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full h-11 bg-bg-muted border border-border-soft rounded-xl px-4 text-sm text-text-main focus:border-primary focus:outline-none" />
          </div>
          <button
            onClick={async () => {
              if (!activeProductId) return;
              try {
                await productsApi.update(activeProductId, { name: editName });
                setProducts(prev => prev.map(p => p.id === activeProductId ? { ...p, name: editName } : p));
              } catch { /* handled silently */ }
            }}
            className="h-10 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-all mt-2"
          >
            Save Changes
          </button>
        </div>
      </RouteDialog>

      <ConfirmDialog
        dialogId="archive-product"
        title="Archive Product"
        description={`Are you sure you want to archive ${activeProduct?.name}? This will hide it from the public catalog.`}
        confirmLabel="Archive Product"
        variant="warning"
        onConfirm={async () => {
          if (!activeProductId) return;
          await productsApi.archive(activeProductId);
          setProducts(prev => prev.filter(p => p.id !== activeProductId));
        }}
      />
    </motion.div>
  );
}
