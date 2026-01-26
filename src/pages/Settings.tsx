import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Building2,
  Shield,
  CreditCard,
  Image as ImageIcon,
  Upload,
  X,
  Mail,
  Phone,
  MapPin,
  Save,
  Key,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Lock,
  Loader2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FormInput } from '../components/forms/FormField';
import { Card } from '../components/ui/Card';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ChangeEmailModal } from '../components/settings/ChangeEmailModal';
import { ChangePasswordModal } from '../components/settings/ChangePasswordModal';
import { cn } from '../lib/utils';
import { roleService } from '../services/role.service';
import { Role } from '../types/models.types';

type SettingsTab = 'business-profile' | 'account-security' | 'roles-permissions' | 'billing';

const businessProfileSchema = z.object({
  legalBusinessName: z.string().min(1, 'Legal business name is required'),
  registrationNumber: z.string().optional(),
  industry: z.string().min(1, 'Industry is required'),
  websiteUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  supportEmail: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  physicalAddress: z.string().optional(),
});

type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

export const Settings = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('business-profile');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'roles-permissions') {
      const fetchRoles = async () => {
        try {
          setLoading(true);
          const response = await roleService.getRoles();
          if (response.success) {
            setRoles(response.data.roles);
          }
        } catch (err) {
          console.error('Failed to fetch roles:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchRoles();
    }
  }, [activeTab]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BusinessProfileFormData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      legalBusinessName: 'TruePas Inc.',
      registrationNumber: '',
      industry: 'Software & Technology',
      websiteUrl: '',
      supportEmail: 'support@truepas.com',
      phoneNumber: '+1 (555) 000-0000',
      physicalAddress: '',
    },
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
  };

  const onSubmit = (data: BusinessProfileFormData) => {
    console.log('Saving business profile:', data);
  };

  const handleDiscard = () => {
    reset();
    setLogoPreview(null);
  };

  const tabs = [
    { id: 'business-profile' as SettingsTab, label: 'Business Profile', icon: Building2 },
    { id: 'account-security' as SettingsTab, label: 'Account Security', icon: Shield },
    { id: 'roles-permissions' as SettingsTab, label: 'Roles & Permissions', icon: Lock },
    { id: 'billing' as SettingsTab, label: 'Billing', icon: CreditCard },
  ];

  const industries = [
    'Software & Technology',
    'Retail & E-commerce',
    'Healthcare',
    'Finance & Banking',
    'Hospitality',
    'Manufacturing',
    'Education',
    'Real Estate',
    'Other',
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
            <p className="text-text-secondary">
              Manage your organization preferences, security settings, and roles.
            </p>
          </div>

          <div className="border-b border-border">
            <nav className="flex items-center gap-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 pb-4 px-1 transition-colors relative',
                      isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
                    )}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {activeTab === 'business-profile' && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-text-primary mb-1">Company Branding</h2>
                  <p className="text-sm text-text-secondary">
                    Update your company logo and brand assets.
                  </p>
                </div>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-background border-2 border-border flex items-center justify-center overflow-hidden">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Company logo" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-text-secondary" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        <Button type="button" size="sm" className="flex items-center gap-2">
                          <Upload size={16} />
                          Upload New
                        </Button>
                      </label>
                      {logoPreview && (
                        <Button type="button" variant="secondary" size="sm" onClick={handleRemoveLogo} className="flex items-center gap-2">
                          <X size={16} />
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary">Recommended: 400x400px. JPG, PNG or SVG. Max 2MB.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-text-primary mb-1">General Information</h2>
                  <p className="text-sm text-text-secondary">Your legal business details for invoices and verification.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput label="Legal Business Name" placeholder="Enter legal business name" required error={errors.legalBusinessName?.message} {...register('legalBusinessName')} />
                  <FormInput label="Registration Number" placeholder="e.g. 12345678" error={errors.registrationNumber?.message} {...register('registrationNumber')} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                <Button type="button" variant="secondary" onClick={handleDiscard}>Discard Changes</Button>
                <Button type="submit" className="flex items-center gap-2">
                  <Save size={16} />
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'account-security' && (
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                        <Mail className="w-5 h-5 text-text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-secondary uppercase">EMAIL ADDRESS</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-base font-medium text-text-primary">alice@company.com</p>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500 border border-green-500/50">
                            <CheckCircle2 className="w-3 h-3" />
                            VERIFIED
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => setIsChangeEmailModalOpen(true)}>Change Email</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roles-permissions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-text-primary">Roles & Permissions</h2>
                  <p className="text-text-secondary">Manage custom roles and system capabilities.</p>
                </div>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus size={16} />
                  Create Role
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {roles.map(role => (
                    <Card key={role.role_id} className="flex items-center justify-between hover:border-primary/30 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-text-primary">{role.role_name}</h3>
                          <span className={cn('text-[10px] px-1.5 py-0.5 rounded uppercase font-bold border',
                            role.role_type === 'system' ? 'border-blue-500/50 text-blue-500 bg-blue-500/10' : 'border-purple-500/50 text-purple-500 bg-purple-500/10'
                          )}>
                            {role.role_type}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">{role.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-text-secondary">
                          <span>Capabilities: {role.capabilities_count}</span>
                          <span>Members: {role.member_count}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="py-12 text-center text-text-secondary">
              <p>Billing module is coming soon.</p>
            </div>
          )}
        </div>
      </div>

      <ChangeEmailModal
        open={isChangeEmailModalOpen}
        onClose={() => setIsChangeEmailModalOpen(false)}
        currentEmail="alice@company.com"
        onEmailChanged={() => { }}
      />

      <ChangePasswordModal
        open={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        currentEmail="alice@company.com"
        onPasswordChanged={() => { }}
      />
    </DashboardLayout>
  );
};
