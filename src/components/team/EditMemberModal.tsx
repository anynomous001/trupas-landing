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
  Pencil,
  Upload,
} from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';

const editMemberSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['Admin', 'Manager', 'Staff']),
});

type EditMemberFormData = z.infer<typeof editMemberSchema>;

interface EditMemberModalProps {
  open: boolean;
  onClose: () => void;
  member: {
    id: string;
    name: string;
    email: string;
    role: string;
    locations: string[];
    avatar?: string;
  };
  onSave: (data: EditMemberFormData & { locations: string[] }) => void;
}

const ROLES = [
  {
    value: 'Admin',
    label: 'Administrator',
    description: 'Full access to all settings and team management.',
    icon: Shield,
  },
  {
    value: 'Manager',
    label: 'Manager',
    description: 'Can manage locations and view reports.',
    icon: Shield,
  },
  {
    value: 'Staff',
    label: 'Staff',
    description: 'Read-only access to dashboard and reports.',
    icon: Shield,
  },
] as const;

export const EditMemberModal = ({
  open,
  onClose,
  member,
  onSave,
}: EditMemberModalProps) => {
  const [locations, setLocations] = useState<string[]>(member.locations || []);
  const [locationInput, setLocationInput] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditMemberFormData>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: {
      firstName: member.name.split(' ')[0] || '',
      lastName: member.name.split(' ').slice(1).join(' ') || '',
      email: member.email,
      role: (member.role as 'Admin' | 'Manager' | 'Staff') || 'Staff',
    },
  });

  const selectedRole = watch('role');
  const selectedRoleData = ROLES.find((r) => r.value === selectedRole) || ROLES[0];

  // Initialize locations from member prop
  useEffect(() => {
    if (open) {
      setLocations(member.locations || []);
      reset({
        firstName: member.name.split(' ')[0] || '',
        lastName: member.name.split(' ').slice(1).join(' ') || '',
        email: member.email,
        role: (member.role as 'Admin' | 'Manager' | 'Staff') || 'Staff',
      });
    }
  }, [open, member, reset]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node)
      ) {
        setIsRoleDropdownOpen(false);
      }
    };

    if (isRoleDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRoleDropdownOpen]);

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && locationInput.trim()) {
      e.preventDefault();
      addLocation();
    }
  };

  const addLocation = () => {
    const trimmed = locationInput.trim();
    if (trimmed && !locations.includes(trimmed)) {
      if (locations.length < 5) {
        setLocations([...locations, trimmed]);
        setLocationInput('');
      }
    }
  };

  const removeLocation = (locationToRemove: string) => {
    setLocations(locations.filter((loc) => loc !== locationToRemove));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG or PNG)');
        return;
      }
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EditMemberFormData) => {
    setIsSaving(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onSave({ ...data, locations });
    setIsSaving(false);
    onClose();
  };

  const handleClose = () => {
    if (!isSaving) {
      reset();
      setLocations(member.locations || []);
      setLocationInput('');
      setAvatarFile(null);
      setAvatarPreview(null);
      setIsRoleDropdownOpen(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Edit Member"
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
        {/* Avatar Section */}
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                member.avatar || member.name.charAt(0)
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer border-2 border-card hover:bg-primary/90 transition-colors"
            >
              <Pencil size={12} className="text-white" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-secondary mb-4">
              Allowed formats: JPG, PNG. Max 2MB.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
                  FIRST NAME
                </label>
                <Input
                  {...register('firstName')}
                  placeholder="Alex"
                  className={cn(errors.firstName && 'border-red-500')}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
                  LAST NAME
                </label>
                <Input
                  {...register('lastName')}
                  placeholder="Sterling"
                  className={cn(errors.lastName && 'border-red-500')}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

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
              placeholder="alex.sterling@truepas.com"
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
                <selectedRoleData.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="flex-1 text-left">{selectedRoleData.label}</span>
              <ChevronDown
                size={16}
                className={cn(
                  'text-text-secondary transition-transform',
                  isRoleDropdownOpen && 'rotate-180'
                )}
              />
            </button>
            {isRoleDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card dark:bg-black dark:border-white/10 border border-border rounded-lg shadow-lg z-10">
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => {
                      setValue('role', role.value);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors',
                      selectedRole === role.value && 'bg-background'
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <role.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-text-primary">{role.label}</p>
                      <p className="text-xs text-text-secondary">{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-text-secondary mt-2">{selectedRoleData.description}</p>
          </div>
        </div>

        {/* Assigned Locations */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
            ASSIGNED LOCATIONS
          </label>
          <div
            className={cn(
              'min-h-[44px] px-3 py-2 rounded-lg border border-border bg-card',
              'flex flex-wrap items-center gap-2',
              'focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent'
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
              <input
                ref={locationInputRef}
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={handleLocationKeyDown}
                onBlur={() => {
                  if (locationInput.trim()) {
                    addLocation();
                  }
                }}
                placeholder={locations.length === 0 ? 'Add location...' : ''}
                className="flex-1 min-w-[120px] outline-none bg-transparent text-text-primary placeholder:text-text-secondary"
              />
            )}
            {locations.length >= 5 && (
              <span className="text-xs text-text-secondary">Maximum 5 locations reached</span>
            )}
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Specify which location data this user can access.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSaving}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving} className="rounded-full">
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

