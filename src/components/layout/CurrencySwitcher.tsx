import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { currencyConfig } from '../../data/site';
import { cn } from '../../utils/cn';

export function CurrencySwitcher({ className }: {className?: string;}) {
  const { currency, setCurrency } = useCart();
  return (
    <div role="group" aria-label="Display currency" className={cn('flex items-center text-[11px] tracking-[0.14em]', className)}>
      {currencyConfig.supported.map((code, i) =>
      <React.Fragment key={code}>
          {i > 0 &&
        <span className="px-1 text-muted-foreground" aria-hidden="true">
              /
            </span>
        }
          <button
          type="button"
          aria-pressed={currency === code}
          onClick={() => setCurrency(code)}
          className={cn(
            'rounded-sm px-1 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-ring',
            currency === code ? 'text-foreground underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'
          )}>
          
            {code}
          </button>
        </React.Fragment>
      )}
    </div>);

}