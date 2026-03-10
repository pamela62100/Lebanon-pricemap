import { useEffect, useState, useCallback } from 'react';
import { cn, formatNumber } from '@/lib/utils';

interface LBPInputProps {
  value: number | '';
  onChange: (value: number | '') => void;
  placeholder?: string;
  error?: string;
  className?: string;
  autoFocus?: boolean;
}

export function LBPInput({
  value,
  onChange,
  placeholder = '0',
  error,
  className,
  autoFocus,
}: LBPInputProps) {
  const [displayValue, setDisplayValue] = useState(
    typeof value === 'number' && value > 0 ? formatNumber(value) : ''
  );

  useEffect(() => {
    if (typeof value === 'number' && value > 0) {
      setDisplayValue(formatNumber(value));
    } else if (value === '') {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value.replace(/[^0-9]/g, '');

      if (raw === '') {
        setDisplayValue('');
        onChange('');
        return;
      }

      const numberValue = parseInt(raw, 10);
      setDisplayValue(formatNumber(numberValue));
      onChange(numberValue);
    },
    [onChange]
  );

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        className={cn(
          'relative bg-white border px-4 sm:px-5 h-14 sm:h-16 rounded-2xl transition-all',
          error
            ? 'border-status-flagged ring-4 ring-status-flagged/5'
            : 'border-border-soft focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5'
        )}
      >
        <div className="flex items-center h-full gap-4">
          <input
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="flex-1 bg-transparent border-none outline-none text-2xl sm:text-3xl font-bold text-text-main placeholder:text-text-muted/30 text-center"
            aria-label="Price in Lebanese pounds"
          />
          <div className="h-8 w-px bg-border-soft" />
          <span className="text-xs font-bold text-text-main uppercase tracking-[0.18em] whitespace-nowrap">
            LBP
          </span>
        </div>
      </div>

      {error ? (
        <p className="text-xs font-medium text-status-flagged px-1">{error}</p>
      ) : null}
    </div>
  );
}