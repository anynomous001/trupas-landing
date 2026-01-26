import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Fingerprint, Lock, MapPin, Smartphone, Monitor, MonitorSpeaker, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FormInput } from '../forms/FormField';
import { cn } from '../../lib/utils';

const addDeviceSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  location: z.string().min(1, 'Location is required'),
  deviceType: z.enum(['kiosk', 'handheld', 'desktop'], {
    required_error: 'Device type is required',
  }),
  serialNumber: z.string().optional(),
  notes: z.string().optional(),
});

type AddDeviceFormData = z.infer<typeof addDeviceSchema>;

interface AddDeviceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddDeviceFormData) => void;
  preselectedLocation?: string;
}

export const AddDeviceModal = ({ open, onClose, onSubmit, preselectedLocation }: AddDeviceModalProps): JSX.Element | null => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<AddDeviceFormData>({
    resolver: zodResolver(addDeviceSchema),
    defaultValues: {
      deviceId: 'T-001', // Auto-generated in real app
      deviceType: 'kiosk',
      location: preselectedLocation || '',
    },
  });

  const watchedDeviceType = watch('deviceType');

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: AddDeviceFormData) => {
    onSubmit(data);
    handleClose();
  };

  const handleDeviceTypeChange = (type: 'kiosk' | 'handheld' | 'desktop') => {
    setValue('deviceType', type);
  };

  if (!open) return null;

  // Mock locations - in real app, this would come from API
  const locations = [
    'Main Entrance',
    'Lobby A',
    'Lobby B',
    'Gate 4',
    'Warehouse',
    'Storage Room B',
    'Main Hall',
    'Front Desk',
    'Lounge',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={handleClose}>
      <div
        className="relative w-full max-w-2xl rounded-lg border border-border bg-card dark:bg-black dark:border-white/10 p-6 shadow-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Add New Device</h2>
            <p className="text-text-secondary mt-1">Enter details for the new kiosk device.</p>
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
          {/* Device Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-4 h-4 text-text-secondary" />
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
                DEVICE INFORMATION
              </h3>
            </div>

            {/* Device ID - Read-only */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">Device ID</label>
              <div className="relative">
                <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <Input
                  value={watch('deviceId')}
                  readOnly
                  className="pl-10 pr-10 bg-background/50 cursor-not-allowed"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              </div>
              <p className="text-xs text-text-secondary">Device ID is auto-generated and cannot be changed.</p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Location
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none z-10" />
                {preselectedLocation ? (
                  <>
                    <Input
                      value={preselectedLocation}
                      readOnly
                      className="pl-10 pr-10 bg-background/50 cursor-not-allowed"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none z-10" />
                    <input type="hidden" {...register('location')} value={preselectedLocation} />
                  </>
                ) : (
                  <>
                    <select
                      {...register('location')}
                      className="w-full h-11 rounded-lg border border-border bg-background pl-10 pr-10 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                    >
                      <option value="">Select location</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-text-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </>
                )}
              </div>
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
              {preselectedLocation && (
                <p className="text-xs text-text-secondary">Location is pre-selected for this location and cannot be changed.</p>
              )}
            </div>

            {/* Device Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Device Type
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Kiosk */}
                <button
                  type="button"
                  onClick={() => handleDeviceTypeChange('kiosk')}
                  className={cn(
                    'relative p-4 rounded-lg border-2 transition-all',
                    watchedDeviceType === 'kiosk'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background hover:border-primary/50'
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Monitor className={cn('w-6 h-6', watchedDeviceType === 'kiosk' ? 'text-primary' : 'text-text-secondary')} />
                    <span className={cn('text-sm font-medium', watchedDeviceType === 'kiosk' ? 'text-primary' : 'text-text-primary')}>
                      Kiosk
                    </span>
                  </div>
                  {watchedDeviceType === 'kiosk' && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>

                {/* Handheld */}
                <button
                  type="button"
                  onClick={() => handleDeviceTypeChange('handheld')}
                  className={cn(
                    'relative p-4 rounded-lg border-2 transition-all',
                    watchedDeviceType === 'handheld'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background hover:border-primary/50'
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Smartphone className={cn('w-6 h-6', watchedDeviceType === 'handheld' ? 'text-primary' : 'text-text-secondary')} />
                    <span className={cn('text-sm font-medium', watchedDeviceType === 'handheld' ? 'text-primary' : 'text-text-primary')}>
                      Handheld
                    </span>
                  </div>
                  {watchedDeviceType === 'handheld' && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>

                {/* Desktop */}
                <button
                  type="button"
                  onClick={() => handleDeviceTypeChange('desktop')}
                  className={cn(
                    'relative p-4 rounded-lg border-2 transition-all',
                    watchedDeviceType === 'desktop'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background hover:border-primary/50'
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <MonitorSpeaker className={cn('w-6 h-6', watchedDeviceType === 'desktop' ? 'text-primary' : 'text-text-secondary')} />
                    <span className={cn('text-sm font-medium', watchedDeviceType === 'desktop' ? 'text-primary' : 'text-text-primary')}>
                      Desktop
                    </span>
                  </div>
                  {watchedDeviceType === 'desktop' && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              </div>
              {errors.deviceType && (
                <p className="text-sm text-red-500">{errors.deviceType.message}</p>
              )}
            </div>

            {/* Serial Number */}
            <FormInput
              label="Serial Number"
              placeholder="Enter serial number..."
              error={errors.serialNumber?.message}
              {...register('serialNumber')}
            />

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">Notes</label>
              <textarea
                {...register('notes')}
                placeholder="Add operational notes here..."
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              {errors.notes && (
                <p className="text-sm text-red-500">{errors.notes.message}</p>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

