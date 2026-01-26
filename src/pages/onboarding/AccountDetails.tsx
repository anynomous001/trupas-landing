import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Globe, Building2, Lock, User, HelpCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { PasswordInput } from '../../components/forms/PasswordInput';
import { PhoneInput } from '../../components/forms/PhoneInput';
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { ROUTES } from '../../config/routes';
import { Input } from '../../components/ui/Input';

const accountDetailsSchema = z
  .object({
    contactName: z.string().min(1, 'Contact name is required'),
    workEmail: z.string().email('Invalid email address'),
    phoneCountry: z.string().min(1, 'Country code is required'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    businessName: z.string().min(1, 'Business name is required'),
    websiteUrl: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^https?:\/\/.+\..+/.test(val),
        'Please enter a valid URL (e.g., https://example.com)'
      ),
    taxId: z.string().min(1, 'Tax ID is required'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .refine(
        (val) => /[A-Z]/.test(val),
        { message: 'Password must contain at least one uppercase letter' }
      )
      .refine(
        (val) => /[a-z]/.test(val),
        { message: 'Password must contain at least one lowercase letter' }
      )
      .refine(
        (val) => /[0-9]/.test(val),
        { message: 'Password must contain at least one number' }
      )
      .refine(
        (val) => /[^a-zA-Z0-9]/.test(val),
        { message: 'Password must contain at least one special character' }
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    termsAccepted: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type AccountDetailsFormData = z.infer<typeof accountDetailsSchema>;

export const AccountDetails = (): JSX.Element => {
  const navigate = useNavigate();
  const setAccountDetails = useOnboardingStore((state) => state.setAccountDetails);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AccountDetailsFormData>({
    resolver: zodResolver(accountDetailsSchema),
    mode: 'onChange', // Validate on change to show errors immediately
    defaultValues: {
      phoneCountry: '+1',
      termsAccepted: false,
    },
  });

  const phoneCountry = watch('phoneCountry');
  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');

  const onSubmit = (data: AccountDetailsFormData) => {
    const accountDetails = {
      contactName: data.contactName,
      workEmail: data.workEmail,
      phoneCountry: data.phoneCountry,
      phoneNumber: data.phoneNumber,
      businessName: data.businessName,
      websiteUrl: data.websiteUrl || '',
      taxId: data.taxId,
      password: data.password,
    };

    setAccountDetails(accountDetails);
    console.log(accountDetails)
    navigate(ROUTES.ONBOARDING.VERIFICATION);
  };

  const passwordsMatch = passwordValue && confirmPasswordValue && passwordValue === confirmPasswordValue;

  return (
    <OnboardingLayout currentStep={1}>
      <div className="space-y-8">
        {/* Header with Log In link */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-text-primary">Create Your Merchant Account</h2>
            <p className="text-text-secondary mt-2">
              Enter your business details to get started with TruePas.
            </p>
          </div>
          <Link
            to={ROUTES.LOGIN}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            Already have an account? <span className="text-primary font-semibold">Log In</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Contact Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  placeholder="e.g. Jane Doe"
                  className="pl-10"
                  {...register('contactName')}
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              </div>
              {errors.contactName && (
                <p className="text-sm text-red-500">{errors.contactName.message}</p>
              )}
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Business Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  placeholder="e.g. Acme Resorts"
                  className="pl-10"
                  {...register('businessName')}
                />
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              </div>
              {errors.businessName && (
                <p className="text-sm text-red-500">{errors.businessName.message}</p>
              )}
            </div>

            {/* Business Website URL */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Business Website URL
              </label>
              <div className="relative">
                <Input
                  type="url"
                  placeholder="https://"
                  className="pl-10"
                  {...register('websiteUrl')}
                />
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              </div>
              {errors.websiteUrl && (
                <p className="text-sm text-red-500">{errors.websiteUrl.message}</p>
              )}
            </div>

            {/* Business Tax ID */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary flex items-center gap-2">
                Business Tax ID <span className="text-red-500">*</span>
                <HelpCircle className="w-4 h-4 text-text-secondary cursor-help" />
              </label>
              <div className="relative">
                <Input
                  placeholder="XX-XXXXXXX"
                  className="pl-10"
                  {...register('taxId')}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              </div>
              {errors.taxId && (
                <p className="text-sm text-red-500">{errors.taxId.message}</p>
              )}
            </div>

            {/* Work Email Address */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Work Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="name@company.com"
                  className="pl-10"
                  {...register('workEmail')}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              </div>
              <p className="text-xs text-text-secondary">
                We'll send a verification link to this email.
              </p>
              {errors.workEmail && (
                <p className="text-sm text-red-500">{errors.workEmail.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <PhoneInput
              label="Phone Number"
              countryCode={phoneCountry}
              onCountryCodeChange={(code) => setValue('phoneCountry', code)}
              required
              error={errors.phoneNumber?.message}
              {...register('phoneNumber')}
            />

            {/* Password */}
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              showStrength
              required
              error={errors.password?.message}
              value={passwordValue || ''}
              {...register('password')}
            />

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Re-enter your password"
                  className="pl-10 pr-10"
                  {...register('confirmPassword')}
                  value={confirmPasswordValue || ''}
                />
                <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                {passwordsMatch && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-success" />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 rounded border-gray-200 dark:border-gray-800 bg-card"
                {...register('termsAccepted')}
              />
              <span className="text-sm text-text-secondary">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.termsAccepted && (
              <p className="text-sm text-red-500">{errors.termsAccepted.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(ROUTES.HOME)}
              className="rounded-full"
            >
              Back
            </Button>
            <Button type="submit" size="lg" className="rounded-full">
              Create Account
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-text-secondary pt-8 border-t border-gray-200 dark:border-gray-800">
          <p>©2024 TruePas Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-text-primary">
              Privacy
            </Link>
            <Link to="#" className="hover:text-text-primary">
              Terms
            </Link>
            <Link to="#" className="hover:text-text-primary">
              Help
            </Link>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

