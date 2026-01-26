import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Building2, MapPin, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FormInput } from '../forms/FormField';

const addLocationSchema = z.object({
  locationName: z.string().min(1, 'Location name is required'),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  open24Hours: z.boolean().default(false),
  opensAt: z.string().optional(),
  closesAt: z.string().optional(),
}).refine((data) => {
  if (!data.open24Hours) {
    return data.opensAt && data.closesAt;
  }
  return true;
}, {
  message: 'Opening and closing times are required when not open 24 hours',
  path: ['opensAt'],
});

type AddLocationFormData = z.infer<typeof addLocationSchema>;

interface AddLocationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddLocationFormData) => void;
}

export const AddLocationModal = ({ open, onClose, onSubmit }: AddLocationModalProps): JSX.Element | null => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<AddLocationFormData>({
    resolver: zodResolver(addLocationSchema),
    defaultValues: {
      open24Hours: false,
      opensAt: '09:00',
      closesAt: '17:00',
      country: '',
    },
  });

  const watchedOpen24Hours = watch('open24Hours');

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: AddLocationFormData) => {
    onSubmit(data);
    handleClose();
  };

  const handle24HoursChange = (checked: boolean) => {
    setValue('open24Hours', checked);
    if (checked) {
      setValue('opensAt', '');
      setValue('closesAt', '');
    } else {
      setValue('opensAt', '09:00');
      setValue('closesAt', '17:00');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={handleClose}>
      <div
        className="relative w-full max-w-2xl rounded-lg border border-border bg-card dark:bg-black dark:border-white/10 p-6 shadow-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Add New Location</h2>
            <p className="text-text-secondary mt-1">Enter details for the new merchant branch.</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-text-secondary" />
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                BASIC INFORMATION
              </h3>
            </div>
            <FormInput
              label="Location Name"
              placeholder="e.g., Downtown Branch"
              required
              error={errors.locationName?.message}
              {...register('locationName')}
            />
          </div>

          {/* Address Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-text-secondary" />
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                ADDRESS DETAILS
              </h3>
            </div>
            <FormInput
              label="Address Line 1"
              placeholder="Street address, P.O. box"
              required
              error={errors.addressLine1?.message}
              {...register('addressLine1')}
            />
            <FormInput
              label="Address Line 2 (Optional)"
              placeholder="Apartment, suite, unit, building, floor"
              error={errors.addressLine2?.message}
              {...register('addressLine2')}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="City"
                placeholder="City"
                required
                error={errors.city?.message}
                {...register('city')}
              />
              <FormInput
                label="State / Province"
                placeholder="State"
                required
                error={errors.state?.message}
                {...register('state')}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Postal Code"
                placeholder="Zip code"
                required
                error={errors.postalCode?.message}
                {...register('postalCode')}
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Country
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  {...register('country')}
                  className="w-full h-11 rounded-lg border border-border bg-background px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
                {errors.country && (
                  <p className="text-sm text-red-500">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-text-secondary" />
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                OPERATING HOURS
              </h3>
            </div>
            <div className="flex items-center justify-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={watchedOpen24Hours}
                  onChange={(e) => handle24HoursChange(e.target.checked)}
                  className="rounded border-border bg-background"
                />
                <span className="text-sm text-text-secondary">Open 24 hours</span>
              </label>
            </div>
            {!watchedOpen24Hours && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">
                    Opens At
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="time"
                      {...register('opensAt')}
                      className="pr-10"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
                  </div>
                  {errors.opensAt && (
                    <p className="text-sm text-red-500">{errors.opensAt.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">
                    Closes At
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="time"
                      {...register('closesAt')}
                      className="pr-10"
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
                  </div>
                  {errors.closesAt && (
                    <p className="text-sm text-red-500">{errors.closesAt.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Location
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

