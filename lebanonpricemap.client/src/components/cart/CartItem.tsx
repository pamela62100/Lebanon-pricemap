import { useState } from 'react';
import type { CartItem } from './StoreOptimizer';

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-[24px] bg-white border border-border-soft shadow-sm">
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-primary text-[20px] sm:text-[22px]">
          inventory_2
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base font-semibold text-text-main truncate">
          {item.productName}
        </p>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onQuantityChange(item.productId, Math.max(1, item.quantity - 1))}
          className="w-9 h-9 rounded-full bg-bg-muted text-text-main hover:bg-bg-base border border-border-soft flex items-center justify-center transition-all"
          aria-label="Decrease quantity"
        >
          <span className="text-lg font-bold leading-none">−</span>
        </button>

        <span className="w-8 sm:w-10 text-center text-sm sm:text-base font-bold text-text-main">
          {item.quantity}
        </span>

        <button
          type="button"
          onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
          className="w-9 h-9 rounded-full bg-bg-muted text-text-main hover:bg-bg-base border border-border-soft flex items-center justify-center transition-all"
          aria-label="Increase quantity"
        >
          <span className="text-lg font-bold leading-none">+</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.productId)}
        className="w-9 h-9 rounded-full text-text-muted hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center shrink-0"
        aria-label="Remove item"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}

interface AddProductInputProps {
  onAdd: (productId: string, productName: string) => void;
  existing: string[];
}

export function AddProductInput({ onAdd, existing }: AddProductInputProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const products = existing.length > 0 ? [] : [];
  const filteredProducts = products.filter(
    (product: any) =>
      !existing.includes(product.id) &&
      product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4 rounded-[24px] border border-dashed border-border-soft bg-white hover:border-primary/40 transition-colors">
        <span className="material-symbols-outlined text-text-muted text-[18px]">add</span>

        <input
          type="text"
          placeholder="Add a product to your cart"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="flex-1 bg-transparent text-sm sm:text-base text-text-main placeholder:text-text-muted focus:outline-none"
        />
      </div>

      {open && filteredProducts.length > 0 ? (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[24px] border border-border-soft shadow-[0_18px_50px_rgba(0,0,0,0.08)] z-20 max-h-64 overflow-y-auto">
          {filteredProducts.map((product: any) => (
            <button
              key={product.id}
              type="button"
              onMouseDown={() => {
                onAdd(product.id, product.name);
                setQuery('');
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4 hover:bg-bg-base text-left transition-colors"
            >
              <span className="material-symbols-outlined text-text-muted text-[18px]">
                inventory_2
              </span>

              <div className="min-w-0">
                <p className="text-sm sm:text-base font-semibold text-text-main truncate">
                  {product.name}
                </p>
                <p className="text-xs sm:text-sm text-text-muted">{product.unit}</p>
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}