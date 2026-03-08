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
        'flex items-center gap-4 bg-bg-surface border px-8 py-6 transition-all',
        error 
          ? 'border-red-600 shadow-[4px_4px_0px_rgba(220,38,38,0.2)]' 
          : 'border-text-main focus-within:shadow-[6px_6px_0px_#0066FF] focus-within:border-primary'
      )}>
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="flex-1 bg-transparent border-none outline-none font-serif text-5xl font-black text-text-main text-center placeholder:text-border-soft"
          aria-label="Price in Lebanese Pounds"
        />
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-l border-border-soft pl-6 py-2">LBP</span>
      </div>
      {error && <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-1">ERROR_CODE // {error}</p>}
    </div>
  );
}
