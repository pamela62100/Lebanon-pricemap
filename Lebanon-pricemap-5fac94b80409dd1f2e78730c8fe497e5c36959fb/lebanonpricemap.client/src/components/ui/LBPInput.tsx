import { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

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
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // While typing: show raw digits. While blurred: show formatted with commas.
  const displayValue = focused
    ? value === '' ? '' : String(value)
    : value === '' ? '' : Number(value).toLocaleString();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/[^0-9]/g, '');
      if (digits === '') {
        onChange('');
      } else {
        onChange(parseInt(digits, 10));
      }
    },
    [onChange]
  );

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div
        className={cn(
          'flex items-center gap-3 px-4 h-11 rounded-xl border transition-all cursor-text',
          focused ? 'border-text-main/30 bg-white' : 'border-border-soft bg-bg-muted',
          error && 'border-red-400 ring-2 ring-red-400/10'
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="flex-1 bg-transparent border-none outline-none text-base font-bold text-text-main placeholder:text-text-muted/40 min-w-0"
          aria-label="Price in Lebanese pounds"
        />
        <div className="h-5 w-px bg-border-soft shrink-0" />
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest shrink-0">
          LBP
        </span>
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500 px-1">{error}</p>
      )}
    </div>
  );
}