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
    <div className={cn('flex flex-col gap-2', className)}>
      <div className={cn(
        'flex items-center gap-3 bg-bg-surface border rounded-xl px-6 py-4 transition-all',
        error ? 'border-[var(--status-flagged-text)]' : 'border-border-soft focus-within:border-primary focus-within:shadow-[0_0_0_3px_var(--primary-soft)]'
      )}>
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="flex-1 bg-transparent border-none outline-none font-display text-4xl font-bold text-text-main text-center"
          aria-label="Price in Lebanese Pounds"
        />
        <span className="text-xl font-medium text-text-muted flex-shrink-0">LBP</span>
      </div>
      {error && <p className="text-xs text-[var(--status-flagged-text)] mt-1">{error}</p>}
    </div>
  );
}
