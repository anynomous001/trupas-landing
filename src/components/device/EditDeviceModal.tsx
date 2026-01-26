import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, MapPin, Smartphone, Monitor, MonitorSpeaker, Check, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { FormInput } from '../forms/FormField';
import { cn } from '../../lib/utils';

const editDeviceSchema = z.object({
    deviceId: z.string().min(1, 'Device ID is required'),
    location: z.string().min(1, 'Location is required'),
    deviceType: z.enum(['kiosk', 'handheld', 'desktop'], {
        required_error: 'Device type is required',
    }),
    serialNumber: z.string().optional(),
    notes: z.string().optional(),
});

type EditDeviceFormData = z.infer<typeof editDeviceSchema>;

interface EditDeviceModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: EditDeviceFormData) => void;
    onDeactivate?: () => void;
    device: {
        id: string;
        location: string;
        deviceType: 'kiosk' | 'handheld' | 'desktop';
        serialNumber?: string;
        notes?: string;
    };
}

export const EditDeviceModal = ({
    open,
    onClose,
    onSubmit,
    onDeactivate,
    device
}: EditDeviceModalProps): JSX.Element | null => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<EditDeviceFormData>({
        resolver: zodResolver(editDeviceSchema),
        defaultValues: {
            deviceId: device.id,
            deviceType: device.deviceType,
            location: device.location,
            serialNumber: device.serialNumber || '',
            notes: device.notes || '',
        },
    });

    const watchedDeviceType = watch('deviceType');

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleFormSubmit = (data: EditDeviceFormData) => {
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
        'NYC - Lobby A',
        'NYC - Lobby B',
        'SFO - Gate 4',
        'LDN - Warehouse',
        'NYC - Main Hall',
        'MIA - Front Desk',
        'SFO - Lounge',
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
                        <h2 className="text-2xl font-bold text-text-primary">Edit Device</h2>
                        <p className="text-text-secondary mt-1">Update details for device <span className="font-mono text-text-primary">{device.id}</span>.</p>
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

                        {/* Device ID */}
                        <FormInput
                            label="Device ID"
                            placeholder="e.g., T-001"
                            required
                            error={errors.deviceId?.message}
                            {...register('deviceId')}
                        />

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-primary">
                                Location
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none z-10" />
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
                            </div>
                            {errors.location && (
                                <p className="text-sm text-red-500">{errors.location.message}</p>
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

                    {/* Deactivate Device Warning Section */}
                    <div className="border border-red-500/50 rounded-lg p-4 bg-red-500/10">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-text-primary mb-3">
                                    Deactivating this device will immediately take it offline and stop all check-ins.
                                    This action can be reversed by an administrator.
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-red-500/50 text-red-500 hover:bg-red-500/20"
                                    onClick={onDeactivate}
                                >
                                    Deactivate Device
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
                        <Button type="submit">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
