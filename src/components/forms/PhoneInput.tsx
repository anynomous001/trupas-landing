import { forwardRef } from 'react';
import { FormInputProps } from './FormField';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface PhoneInputProps extends Omit<FormInputProps, 'type'> {
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      error,
      required,
      countryCode,
      onCountryCodeChange,
      className,
      ...inputProps
    },
    ref
  ) => {
    const countryCodes = [
      { code: '+1', country: 'US' },
      { code: '+44', country: 'UK' },
      { code: '+91', country: 'IN' },
      { code: '+86', country: 'CN' },
    ];

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex gap-2">
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange(e.target.value)}
            className={cn(
              'h-11 rounded-lg border border-border bg-card px-3',
              'text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            )}
          >
            {countryCodes.map(({ code, country }) => (
              <option key={code} value={code}>
                {code} ({country})
              </option>
            ))}
          </select>
          <Input
            ref={ref}
            type="tel"
            className={cn('flex-1', className)}
            placeholder="Phone number"
            {...inputProps}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

