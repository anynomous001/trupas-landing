import { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FormInput } from '../components/forms/FormField';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ChangeEmailModal } from '../components/settings/ChangeEmailModal';
import { ChangePasswordModal } from '../components/settings/ChangePasswordModal';
import { cn } from '../lib/utils';

type SettingsTab = 'business-profile' | 'account-security' | 'billing';

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
    // In a real app, you'd send this to a backend
  };

  const handleDiscard = () => {
    reset();
    setLogoPreview(null);
  };

  const tabs = [
    { id: 'business-profile' as SettingsTab, label: 'Business Profile', icon: Building2 },
    { id: 'account-security' as SettingsTab, label: 'Account Security', icon: Shield },
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
          {/* Header Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
            <p className="text-text-secondary">
              Manage your organization preferences, security settings, and billing details.
            </p>
          </div>

          {/* Tab Navigation */}
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
                      isActive
                        ? 'text-primary'
                        : 'text-text-secondary hover:text-text-primary'
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

          {/* Business Profile Content */}
          {activeTab === 'business-profile' && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Company Branding Section */}
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
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button type="button" size="sm" className="flex items-center gap-2">
                          <Upload size={16} />
                          Upload New
                        </Button>
                      </label>
                      {logoPreview && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={handleRemoveLogo}
                          className="flex items-center gap-2"
                        >
                          <X size={16} />
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary">
                      Recommended: 400x400px. JPG, PNG or SVG. Max 2MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* General Information Section */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-text-primary mb-1">General Information</h2>
                  <p className="text-sm text-text-secondary">
                    Your legal business details for invoices and verification.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Legal Business Name"
                    placeholder="Enter legal business name"
                    required
                    error={errors.legalBusinessName?.message}
                    {...register('legalBusinessName')}
                  />
                  <FormInput
                    label="Registration Number"
                    placeholder="e.g. 12345678"
                    error={errors.registrationNumber?.message}
                    {...register('registrationNumber')}
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-primary">
                      Industry
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register('industry')}
                        className="w-full h-11 rounded-lg border border-border bg-background px-3 pr-10 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                      >
                        {industries.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
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
                    {errors.industry && (
                      <p className="text-sm text-red-500">{errors.industry.message}</p>
                    )}
                  </div>
                  <FormInput
                    label="Website URL"
                    placeholder="https://example.com"
                    type="url"
                    error={errors.websiteUrl?.message}
                    {...register('websiteUrl')}
                  />
                </div>
              </div>

              {/* Contact Details Section */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-text-primary mb-1">Contact Details</h2>
                  <p className="text-sm text-text-secondary">
                    Where customers and our support team can reach you.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-primary">
                      Support Email
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                      <Input
                        type="email"
                        placeholder="support@example.com"
                        className="pl-10"
                        {...register('supportEmail')}
                      />
                    </div>
                    {errors.supportEmail && (
                      <p className="text-sm text-red-500">{errors.supportEmail.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-primary">
                      Phone Number
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="pl-10"
                        {...register('phoneNumber')}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-text-primary">Physical Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-text-secondary" />
                      <textarea
                        {...register('physicalAddress')}
                        placeholder="Street address, City, State, Zip Code"
                        rows={3}
                        className="w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>
                    {errors.physicalAddress && (
                      <p className="text-sm text-red-500">{errors.physicalAddress.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                <Button type="button" variant="secondary" onClick={handleDiscard}>
                  Discard Changes
                </Button>
                <Button type="submit" className="flex items-center gap-2">
                  <Save size={16} />
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {/* Account Security Content */}
          {activeTab === 'account-security' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-text-primary">Account Security</h2>
                <p className="text-text-secondary">
                  Manage your sign-in credentials and review active sessions to ensure your account remains secure.
                </p>
              </div>

              {/* Email Address Section */}
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                        <Mail className="w-5 h-5 text-text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                          EMAIL ADDRESS
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-base font-medium text-text-primary">alice@company.com</p>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500 border border-green-500/50">
                            <CheckCircle2 className="w-3 h-3" />
                            VERIFIED
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary mt-2">
                          Used for sign-in and security alerts.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2"
                    onClick={() => setIsChangeEmailModalOpen(true)}
                  >
                    Change Email
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>

              {/* Password Section */}
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                        <Key className="w-5 h-5 text-text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                          PASSWORD
                        </p>
                        <p className="text-base font-mono text-text-primary mt-1">••••••••••••</p>
                        <p className="text-sm text-text-secondary mt-2">
                          Last changed: Dec 1, 2025
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2"
                    onClick={() => setIsChangePasswordModalOpen(true)}
                  >
                    <RotateCcw size={16} />
                    Change Password
                  </Button>
                </div>
              </div>

              {/* Important Security Notice */}
              <div className="rounded-lg border-2 border-red-500/50 bg-red-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-semibold text-text-primary mb-1">
                      Important Security Notice
                    </h3>
                    <p className="text-sm text-text-secondary">
                      Changing your email or password will automatically log you out of all active sessions on other devices. You will need to sign in again with your new credentials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab === 'billing' && (
            <div className="py-12 text-center">
              <p className="text-text-secondary">This section is coming soon.</p>
            </div>
          )}
        </div>
      </div>

      <ChangeEmailModal
        open={isChangeEmailModalOpen}
        onClose={() => setIsChangeEmailModalOpen(false)}
        currentEmail="alice@company.com"
        onEmailChanged={(newEmail) => {
          console.log('Email changed to:', newEmail);
          // In a real app, you'd update the email in the backend
        }}
      />

      <ChangePasswordModal
        open={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        currentEmail="alice@company.com"
        onPasswordChanged={() => {
          console.log('Password changed successfully');
          // In a real app, you'd handle the password change
        }}
      />
    </DashboardLayout>
  );
};

