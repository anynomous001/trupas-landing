import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { FormInput } from '../forms/FormField';

const editLocationSchema = z.object({
  locationName: z.string().min(1, 'Location name is required'),
  expectedDailyVolume: z.string().min(1, 'Expected daily volume is required'),
  operatingHours: z.string().min(1, 'Operating hours are required'),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

type EditLocationFormData = z.infer<typeof editLocationSchema>;

interface EditLocationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EditLocationFormData) => void;
  onDisable: () => void;
  location: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    expectedDailyVolume?: number;
    operatingHours?: string;
  };
}

export const EditLocationModal = ({
  open,
  onClose,
  onSubmit,
  onDisable,
  location,
}: EditLocationModalProps): JSX.Element | null => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditLocationFormData>({
    resolver: zodResolver(editLocationSchema),
    defaultValues: {
      locationName: location.name,
      expectedDailyVolume: location.expectedDailyVolume?.toString() || '500',
      operatingHours: location.operatingHours || '09:00 AM - 05:00 PM',
      addressLine1: location.address.split(',')[0] || location.address,
      city: location.city,
      state: location.state,
      postalCode: location.postalCode,
      country: location.country,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: EditLocationFormData) => {
    onSubmit(data);
    handleClose();
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
            <h2 className="text-2xl font-bold text-text-primary">Edit Location</h2>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4 text-text-secondary" />
              <p className="text-sm text-text-secondary">{location.name}</p>
            </div>
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
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
              GENERAL INFORMATION
            </h3>
            <FormInput
              label="Location Name"
              placeholder="e.g., Downtown Branch"
              required
              error={errors.locationName?.message}
              {...register('locationName')}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Expected Daily Volume
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  {...register('expectedDailyVolume')}
                  className="flex h-11 w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="500"
                />
                <span className="text-sm text-text-secondary whitespace-nowrap">Check-ins</span>
              </div>
              {errors.expectedDailyVolume && (
                <p className="text-sm text-red-500">{errors.expectedDailyVolume.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Operating Hours
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register('operatingHours')}
                  className="flex h-11 w-full rounded-lg border border-border bg-background px-4 py-2 pr-10 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="09:00 AM - 05:00 PM"
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
              </div>
              {errors.operatingHours && (
                <p className="text-sm text-red-500">{errors.operatingHours.message}</p>
              )}
            </div>
          </div>

          {/* Address Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
              ADDRESS DETAILS
            </h3>
            <FormInput
              label="Address Line 1"
              placeholder="Street address, P.O. box"
              required
              error={errors.addressLine1?.message}
              {...register('addressLine1')}
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

          {/* Disable Location Warning */}
          <div className="border border-red-500/50 rounded-lg p-4 bg-red-500/10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-text-primary mb-3">
                  Disabling this location will immediately take all associated terminals offline. This
                  action cannot be undone by basic staff.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="border-red-500/50 text-red-500 hover:bg-red-500/20"
                  onClick={onDisable}
                >
                  Disable Location
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

