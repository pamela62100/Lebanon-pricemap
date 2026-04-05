import { cn, formatLBP } from '@/lib/utils';

interface PriceChipProps {
  price: number;
  variant?: 'default' | 'orange' | 'large';
  className?: string;
}

export function PriceChip({ price, variant = 'default', className }: PriceChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-bold rounded-lg tabular-nums',
        variant === 'default' && 'px-2.5 py-1 bg-bg-muted text-text-main text-xs',
        variant === 'orange'  && 'px-2.5 py-1 bg-primary/10 text-primary text-xs',
        variant === 'large'   && 'px-4 py-2 bg-bg-muted text-text-main text-xl',
        className
      )}
    >
      {formatLBP(price)}
    </span>
  );
}