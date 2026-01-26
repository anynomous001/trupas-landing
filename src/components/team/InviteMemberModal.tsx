import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X,
  Mail,
  Shield,
  ChevronDown,
  Loader2,
  Send,
  Search,
  MapPin,
} from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';
import { roleService } from '../../services/role.service';
import { Role } from '../../types/models.types';

// Mock locations data
const MOCK_LOCATIONS = [
  'Downtown Office',
  'Main Branch',
  'North Side Location',
  'South Side Branch',
  'Central Plaza',
  'West End Office',
  'East Coast Branch',
  'Airport Terminal',
  'Shopping Mall Kiosk',
  'Corporate Headquarters',
  'Suburban Office',
  'Retail Store Front',
];

const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
});

type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
  onInvite: (data: InviteMemberFormData & { locations: string[] }) => void;
  onSuccess?: (data: InviteMemberFormData & { locations: string[] }) => void;
}



export const InviteMemberModal = ({
  open,
  onClose,
  onInvite,
  onSuccess,
}: InviteMemberModalProps) => {
  const [locations, setLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>(MOCK_LOCATIONS);
  const [isSending, setIsSending] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: '',
      role: 'operator',
    },
  });

  const selectedRole = watch('role');
  const selectedRoleData = availableRoles.find((r) => r.roleSlug === selectedRole);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const response = await roleService.getRoles();
        if (response.success) {
          setAvailableRoles(response.data.roles);
        }
      } catch (error) {
        console.error('Failed to load roles:', error);
      }
    };
    loadRoles();
  }, []);

  // ... (omitting unchanged parts for brevity if possible, but replace_file_content needs contiguous block. I'll target specific blocks if I can, but here the changes are scattered. I will do one large block covering the component body or split it)

  // Actually, I can do multiple replacements if `multi_replace_file_content` is used, but for now I will stick to `replace_file_content` for the whole file or large chunks if I am confident.
  // Let's use `multi_replace_file_content` for `InviteMemberModal.tsx` since changes are in `selectedRoleData` logic and the JSX rendering. 


  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      reset({
        email: '',
        role: 'operator',
      });
      setLocations([]);
      setLocationInput('');
      setIsRoleDropdownOpen(false);
      setIsLocationDropdownOpen(false);
      setFilteredLocations(MOCK_LOCATIONS);
    }
  }, [open, reset]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node)
      ) {
        setIsRoleDropdownOpen(false);
      }
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLocationDropdownOpen(false);
      }
    };

    if (isRoleDropdownOpen || isLocationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRoleDropdownOpen, isLocationDropdownOpen]);

  // Filter locations based on input
  useEffect(() => {
    if (locationInput.trim()) {
      const filtered = MOCK_LOCATIONS.filter((loc) =>
        loc.toLowerCase().includes(locationInput.toLowerCase())
      ).filter((loc) => !locations.includes(loc)); // Exclude already selected locations
      setFilteredLocations(filtered);
      setIsLocationDropdownOpen(true);
    } else {
      // Show all locations that haven't been selected yet
      const available = MOCK_LOCATIONS.filter((loc) => !locations.includes(loc));
      setFilteredLocations(available);
      // Keep dropdown closed initially when empty, but will open on focus
    }
  }, [locationInput, locations]);

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // If there's a filtered result, select the first one
      if (filteredLocations.length > 0 && locationInput.trim()) {
        selectLocation(filteredLocations[0]);
      }
    } else if (e.key === 'Escape') {
      setIsLocationDropdownOpen(false);
      locationInputRef.current?.blur();
    }
  };

  const selectLocation = (location: string) => {
    if (!locations.includes(location) && locations.length < 5) {
      setLocations([...locations, location]);
      setLocationInput('');
      setIsLocationDropdownOpen(false);
      locationInputRef.current?.focus();
    }
  };

  const removeLocation = (locationToRemove: string) => {
    setLocations(locations.filter((loc) => loc !== locationToRemove));
  };

  const onSubmit = async (data: InviteMemberFormData) => {
    setIsSending(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const invitationData = { ...data, locations };
    onInvite(invitationData);
    setIsSending(false);
    // Close this modal and trigger success callback
    handleClose();
    if (onSuccess) {
      onSuccess(invitationData);
    }
  };

  const handleClose = () => {
    if (!isSending) {
      reset();
      setLocations([]);
      setLocationInput('');
      setIsRoleDropdownOpen(false);
      setIsLocationDropdownOpen(false);
      setFilteredLocations(MOCK_LOCATIONS);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Invite Member"
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <Input
              {...register('email')}
              type="email"
              placeholder="colleague@company.com"
              className={cn('pl-10', errors.email && 'border-red-500')}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Role & Permissions */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
            ROLE & PERMISSIONS
          </label>
          <div className="relative" ref={roleDropdownRef}>
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card text-text-primary hover:border-primary/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <span className="flex-1 text-left">{selectedRoleData?.roleName || 'Select Role'}</span>

              <ChevronDown
                size={16}
                className={cn(
                  'text-text-secondary transition-transform',
                  isRoleDropdownOpen && 'rotate-180'
                )}
              />
            </button>
            {isRoleDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card dark:bg-black dark:border-white/10 border border-border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {availableRoles.map((role) => (
                  <button
                    key={role.roleId}
                    type="button"
                    onClick={() => {
                      setValue('role', role.roleSlug);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors',
                      selectedRole === role.roleSlug && 'bg-background'
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-text-primary">{role.roleName}</p>
                      <p className="text-xs text-text-secondary truncate">{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-text-secondary mt-2">{selectedRoleData?.description}</p>

          </div>
        </div>

        {/* Assigned Locations */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
            ASSIGNED LOCATIONS
          </label>
          <div className="relative" ref={locationDropdownRef}>
            <div
              className={cn(
                'min-h-[44px] px-3 py-2 rounded-lg border border-border bg-card',
                'flex flex-wrap items-center gap-2',
                'focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all',
                isLocationDropdownOpen && 'ring-2 ring-primary border-transparent'
              )}
              onClick={() => locationInputRef.current?.focus()}
            >
              {locations.map((location, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background border border-border text-sm text-text-primary"
                >
                  {location}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLocation(location);
                    }}
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              {locations.length < 5 && (
                <div className="flex-1 flex items-center gap-2 min-w-[120px]">
                  <Search className="w-4 h-4 text-text-secondary" />
                  <input
                    ref={locationInputRef}
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyDown={handleLocationKeyDown}
                    onFocus={() => {
                      if (filteredLocations.length > 0) {
                        setIsLocationDropdownOpen(true);
                      } else if (!locationInput.trim()) {
                        // If empty and no filtered results, show all available locations
                        const available = MOCK_LOCATIONS.filter((loc) => !locations.includes(loc));
                        setFilteredLocations(available);
                        if (available.length > 0) {
                          setIsLocationDropdownOpen(true);
                        }
                      }
                    }}
                    placeholder={locations.length === 0 ? 'Type to search locations...' : ''}
                    className="flex-1 outline-none bg-transparent text-text-primary placeholder:text-text-secondary"
                  />
                </div>
              )}
              {locations.length >= 5 && (
                <span className="text-xs text-text-secondary">Maximum 5 locations reached</span>
              )}
            </div>
            {isLocationDropdownOpen && filteredLocations.length > 0 && locations.length < 5 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card dark:bg-black dark:border-white/10 border border-border rounded-lg shadow-lg z-10 max-h-[200px] overflow-y-auto">
                {filteredLocations.map((location) => {
                  const isSelected = locations.includes(location);
                  return (
                    <button
                      key={location}
                      type="button"
                      onClick={() => selectLocation(location)}
                      disabled={isSelected}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors text-left',
                        isSelected && 'bg-background opacity-50 cursor-not-allowed',
                        !isSelected && 'cursor-pointer'
                      )}
                    >
                      <MapPin className="w-4 h-4 text-text-secondary flex-shrink-0" />
                      <span className="flex-1 text-sm text-text-primary">{location}</span>
                      {isSelected && (
                        <span className="text-xs text-primary font-medium">Selected</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            {isLocationDropdownOpen && filteredLocations.length === 0 && locationInput.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card dark:bg-black dark:border-white/10 border border-border rounded-lg shadow-lg z-10 p-4 text-center">
                <p className="text-sm text-text-secondary">No locations found matching "{locationInput}"</p>
              </div>
            )}
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Specify which location data this user can access. Type to search available locations.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSending}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSending} className="rounded-full">
            {isSending ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Send Invitation
              </>
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

