import { ReactNode, forwardRef } from 'react';
import { Input, InputProps } from '../ui/Input';
import { cn } from '../../lib/utils';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children?: ReactNode;
  className?: string;
}

export const FormField = ({
  label,
  error,
  required,
  children,
  className,
}: FormFieldProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export interface FormInputProps extends InputProps {
  label: string;
  error?: string;
  required?: boolean;
  icon?: ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required, icon, className, ...inputProps }, ref) => {
    return (
      <FormField label={label} error={error} required={required}>
        <div className="relative">
          <Input
            ref={ref}
            className={cn(icon && 'pr-10', className)}
            {...inputProps}
          />
          {icon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {icon}
            </div>
          )}
        </div>
      </FormField>
    );
  }
);

FormInput.displayName = 'FormInput';

