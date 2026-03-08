import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CartItem } from './StoreOptimizer';
import { getAllProducts } from './StoreOptimizer';

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-surface border border-border-soft">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>inventory_2</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-main truncate">{item.productName}</p>
      </div>
      {/* Quantity stepper */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onQuantityChange(item.productId, Math.max(1, item.quantity - 1))}
          className="w-7 h-7 rounded-lg bg-bg-muted text-text-sub hover:bg-bg-surface border border-border-soft text-sm font-bold flex items-center justify-center transition-colors"
        >−</button>
        <span className="w-6 text-center text-sm font-bold text-text-main">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
          className="w-7 h-7 rounded-lg bg-bg-muted text-text-sub hover:bg-bg-surface border border-border-soft text-sm font-bold flex items-center justify-center transition-colors"
        >+</button>
      </div>
      <button
        onClick={() => onRemove(item.productId)}
        className="w-7 h-7 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
      </button>
    </div>
  );
}

// ─── Product search / add ────────────────────────────────────────────────────
interface AddProductInputProps {
  onAdd: (productId: string, productName: string) => void;
  existing: string[];
}

export function AddProductInput({ onAdd, existing }: AddProductInputProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const products = getAllProducts().filter(
    p =>
      !existing.includes(p.id) &&
      p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-border-soft bg-bg-base hover:border-primary/40 transition-colors">
        <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '18px' }}>add</span>
        <input
          type="text"
          placeholder="Add a product to your cart…"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="flex-1 bg-transparent text-sm text-text-main placeholder-text-muted focus:outline-none"
        />
      </div>
      {open && products.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-bg-surface rounded-xl border border-border-soft shadow-lg z-20 max-h-48 overflow-y-auto">
          {products.map(p => (
            <button
              key={p.id}
              onMouseDown={() => { onAdd(p.id, p.name); setQuery(''); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-base text-left transition-colors"
            >
              <span className="material-symbols-outlined text-text-muted" style={{ fontSize: '16px' }}>inventory_2</span>
              <div>
                <p className="text-sm font-semibold text-text-main">{p.name}</p>
                <p className="text-xs text-text-muted">{p.unit}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
