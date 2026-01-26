import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X,
  Key as KeyIcon,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Lock as LockIcon,
  CheckCircle2,
  LogIn,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PasswordInput } from '../forms/PasswordInput';
import { OTPInput } from '../forms/OTPInput';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

const changePasswordStep1Schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(1, 'New password is required')
      .min(8, 'Password must be at least 8 characters')
      .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((val) => /[a-z]/.test(val), {
        message: 'Password must contain at least one lowercase letter',
      })
      .refine((val) => /[0-9]/.test(val), {
        message: 'Password must contain at least one number',
      })
      .refine((val) => /[^a-zA-Z0-9]/.test(val), {
        message: 'Password must contain at least one special character',
      }),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ChangePasswordStep1FormData = z.infer<typeof changePasswordStep1Schema>;

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  currentEmail: string;
  onPasswordChanged?: () => void;
}

export const ChangePasswordModal = ({
  open,
  onClose,
  currentEmail,
  onPasswordChanged,
}: ChangePasswordModalProps): JSX.Element | null => {
  const [step, setStep] = useState<1 | 2>(1);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordStep1FormData>({
    resolver: zodResolver(changePasswordStep1Schema),
  });

  // const newPasswordValue = watch('newPassword'); // Strength indicator could use this later

  const handleClose = () => {
    setStep(1);
    setOtp('');
    setShowCurrentPassword(false);
    setIsVerifying(false);
    setShowSuccess(false);
    reset();
    onClose();
  };

  const handleStep1Submit = () => {
    // Simulate API call to send OTP to email
    setTimeout(() => {
      setStep(2);
      // Start resend timer (60 seconds)
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  const handleResendOTP = () => {
    if (resendTimer > 0) return;
    // Simulate resending OTP
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) return;
    setIsVerifying(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifying(false);
      if (onPasswordChanged) {
        onPasswordChanged();
      }
      setShowSuccess(true);
    }, 2000);
  };

  const handleSignIn = () => {
    handleClose();
    // In a real app, this would redirect to login page
    // navigate(ROUTES.LOGIN);
  };

  if (!open) return null;

  // Show success modal as separate overlay
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <Card className="w-full max-w-md relative">
          {/* Header with Close Button */}
          <div className="flex items-center justify-end mb-4">
            <button
              onClick={handleClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Success Content */}
          <div className="space-y-6 pb-4">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold text-text-primary">
                Your password has been successfully changed!
              </h3>
              <p className="text-sm text-text-secondary">
                You have been logged out of all active sessions and will need to sign in again with
                your new password.
              </p>
            </div>

            {/* Sign In Button */}
            <div className="pt-4">
              <Button
                onClick={handleSignIn}
                className="w-full flex items-center justify-center gap-2"
              >
                <LogIn size={16} />
                Sign In
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {step === 1 ? (
            <h3 className="text-xl font-semibold text-text-primary">Change Password</h3>
          ) : (
            <div>
              <p className="text-sm text-primary mb-1">STEP 2 OF 2</p>
              <h3 className="text-xl font-semibold text-text-primary">Verify Password Change</h3>
            </div>
          )}
          <button
            onClick={handleClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step 1: Request Change */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-text-secondary">Step 1 of 2: Request Change</p>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-primary rounded-full"></div>
                </div>
                <span className="text-sm text-text-secondary">50%</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(handleStep1Submit)} className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Current Password
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter your current password"
                    className="pl-10 pr-10"
                    {...register('currentPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  New Password
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <PasswordInput
                  label="New Password"
                  placeholder="Enter your new password"
                  {...register('newPassword')}
                  error={errors.newPassword?.message}
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Confirm New Password
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm your new password"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
              </div>

              {/* Warning Message */}
              <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary mb-1">
                      Re-verification Required
                    </p>
                    <p className="text-sm text-text-secondary">
                      Changing your password will require you to verify via email. You will be
                      logged out of all active sessions immediately upon confirmation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" className="flex items-center gap-2">
                  Send OTP
                  <ArrowRight size={16} />
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Verify Password Change */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Instruction Text */}
            <div>
              <p className="text-sm text-text-secondary">
                We've sent a 6-digit verification code to <strong>{currentEmail}</strong>. Please
                enter the code below to confirm this change.
              </p>
            </div>

            {/* OTP Input */}
            <div>
              <OTPInput length={6} value={otp} onChange={setOtp} />
            </div>

            {/* Resend OTP */}
            <div className="flex items-center justify-end gap-2">
              <p className="text-sm text-text-secondary">Didn't receive the code?</p>
              <button
                onClick={handleResendOTP}
                disabled={resendTimer > 0}
                className={cn(
                  'text-sm text-primary hover:underline transition-colors',
                  resendTimer > 0 && 'opacity-50 cursor-not-allowed'
                )}
              >
                {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
              </button>
            </div>

            {/* Information Message */}
            <div className="rounded-lg bg-background border border-border p-4">
              <div className="flex items-center gap-2">
                <LockIcon className="w-4 h-4 text-text-secondary" />
                <p className="text-sm text-text-secondary">
                  Your account will be logged out upon successful verification.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setStep(1);
                  setOtp('');
                }}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </Button>
              <Button
                type="button"
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6 || isVerifying}
                className="flex items-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Update
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

