import { useState, useCallback } from 'react';
import { cn, formatNumber } from '@/lib/utils';

interface LBPInputProps {
  value: number | '';
  onChange: (value: number | '') => void;
  placeholder?: string;
  error?: string;
  className?: string;
  autoFocus?: boolean;
}

export function LBPInput({ value, onChange, placeholder = '0', error, className, autoFocus }: LBPInputProps) {
  const [displayValue, setDisplayValue] = useState(typeof value === 'number' && value > 0 ? formatNumber(value) : '');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }
    const num = parseInt(raw, 10);
    setDisplayValue(formatNumber(num));
    onChange(num);
  }, [onChange]);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className={cn(
        'relative group bg-bg-base border border-border-primary px-6 py-4 rounded-md shadow-card transition-all',
        error 
          ? 'border-status-flagged ring-4 ring-status-flagged/5' 
          : 'focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5'
      )}>
        <div className="flex items-center gap-4">
          <input
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="flex-1 bg-transparent border-none outline-none font-data text-3xl font-black text-text-main text-center placeholder:text-text-muted/20"
            aria-label="Price in Lebanese Pounds"
          />
          <div className="h-8 w-px bg-border-primary" />
          <span className="text-[10px] font-data font-black text-primary uppercase tracking-[0.2em] whitespace-nowrap">LBP_Fixed</span>
        </div>
      </div>
      {error && <p className="text-[9px] font-data font-black text-status-flagged uppercase tracking-widest mt-2 px-1">Critical_Error // {error}</p>}
    </div>
  );
}
