import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FormInputProps } from './FormField';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

interface PasswordInputProps extends Omit<FormInputProps, 'type' | 'icon'> {
  showStrength?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      error,
      required,
      showStrength = false,
      className,
      value, // This is only for displaying strength, not for controlling the input
      ...inputProps
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    
    // Use value prop only for strength indicator, not for controlling input
    const passwordValueForStrength = (value as string) || '';

    const getPasswordStrength = (pwd: string): { strength: number; color: string; label: string } => {
      if (!pwd) return { strength: 0, color: 'bg-gray-600', label: '' };
      
      let strength = 0;
      if (pwd.length >= 8) strength++;
      if (/[a-z]/.test(pwd)) strength++;
      if (/[A-Z]/.test(pwd)) strength++;
      if (/[0-9]/.test(pwd)) strength++;
      if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

      const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-success'];
      const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

      return {
        strength,
        color: colors[strength - 1] || 'bg-gray-600',
        label: labels[strength - 1] || '',
      };
    };

    const strength = getPasswordStrength(passwordValueForStrength);

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <Input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={cn('pr-10', className)}
            {...inputProps}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {showStrength && passwordValueForStrength && (
          <div className="space-y-1">
            <div className="flex gap-1 h-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={cn(
                    'flex-1 rounded-full',
                    level <= strength.strength ? strength.color : 'bg-gray-600'
                  )}
                />
              ))}
            </div>
            {strength.label && (
              <p className="text-xs text-text-secondary">Password strength: {strength.label}</p>
            )}
          </div>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

