import { cn, formatLBP } from '@/lib/utils';

interface PriceChipProps {
  price: number;
  variant?: 'default' | 'orange' | 'large';
  className?: string;
}

export function PriceChip({ price, variant = 'default', className }: PriceChipProps) {
  return (
    <span className={cn(
      'inline-flex items-center font-bold rounded-full',
      variant === 'default' && 'px-3 py-1 bg-bg-muted text-text-main text-sm',
      variant === 'orange' && 'px-3 py-1 bg-primary text-white text-sm',
      variant === 'large' && 'px-5 py-2 bg-bg-muted text-text-main text-2xl',
      className
    )}>
      {formatLBP(price)}
    </span>
  );
}
