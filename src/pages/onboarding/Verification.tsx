import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Pencil, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { OTPInput } from '../../components/forms/OTPInput';
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { ROUTES } from '../../config/routes';

const verificationSchema = z.object({
  emailOtp: z.string().length(6, 'OTP must be 6 digits'),
  phoneOtp: z.string().length(6, 'OTP must be 6 digits'),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

const useCountdown = (initialSeconds: number) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const start = () => {
    setSeconds(initialSeconds);
    setIsActive(true);
  };

  return { seconds, isActive, start };
};

const formatCountdown = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const maskPhone = (country: string, phone: string): string => {
  const last4 = phone.slice(-4);
  return `${country} (***) ***-${last4}`;
};

export const Verification = (): JSX.Element => {
  const navigate = useNavigate();
  const accountDetails = useOnboardingStore((state) => state.accountDetails);
  const setEmailVerified = useOnboardingStore((state) => state.setEmailVerified);
  const setPhoneVerified = useOnboardingStore((state) => state.setPhoneVerified);

  const [emailVerified, setEmailVerifiedLocal] = useState(false);
  const [phoneVerified, setPhoneVerifiedLocal] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [phoneVerifying, setPhoneVerifying] = useState(false);
  const [emailError, setEmailError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const emailCountdown = useCountdown(300); // 5 minutes
  const phoneCountdown = useCountdown(300); // 5 minutes
  
  // Use refs to track verification in progress and prevent multiple triggers
  const emailVerifyingRef = useRef(false);
  const phoneVerifyingRef = useRef(false);

  const {
    watch,
    setValue,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      emailOtp: '',
      phoneOtp: '',
    },
  });

  const emailOtp = watch('emailOtp');
  const phoneOtp = watch('phoneOtp');

  // Redirect if no account details
  useEffect(() => {
    if (!accountDetails) {
      navigate(ROUTES.ONBOARDING.ACCOUNT_DETAILS);
    }
  }, [accountDetails, navigate]);

  // Start countdowns on mount
  useEffect(() => {
    emailCountdown.start();
    phoneCountdown.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Verify email OTP when 6 digits are entered
  useEffect(() => {
    // Reset verifying state if OTP becomes empty
    if (emailOtp.length === 0) {
      setEmailVerifying(false);
      emailVerifyingRef.current = false;
      return;
    }

    // Only verify if we have 6 digits, not already verified, and not currently verifying
    if (emailOtp.length === 6 && !emailVerified && !emailVerifyingRef.current) {
      emailVerifyingRef.current = true;
      setEmailVerifying(true);
      setEmailError(''); // Clear any previous errors
      
      const currentOtp = emailOtp; // Capture current OTP value
      
      // Artificial delay for verification
      const timer = setTimeout(() => {
        // Fixed successful OTP: 123456
        if (currentOtp === '123456') {
          setEmailVerifiedLocal(true);
          setEmailVerified(true);
          setEmailError('');
        } else {
          // Invalid OTP - show error and reset
          setEmailError('Invalid OTP. Please try again.');
          setValue('emailOtp', '');
          setTimeout(() => setEmailError(''), 3000); // Clear error after 3 seconds
        }
        setEmailVerifying(false);
        emailVerifyingRef.current = false;
      }, 2000); // 2 second delay

      return () => {
        clearTimeout(timer);
        emailVerifyingRef.current = false;
      };
    }
  }, [emailOtp, emailVerified, setEmailVerified, setValue]);

  // Verify phone OTP when 6 digits are entered
  useEffect(() => {
    // Reset verifying state if OTP becomes empty
    if (phoneOtp.length === 0) {
      setPhoneVerifying(false);
      phoneVerifyingRef.current = false;
      return;
    }

    // Only verify if we have 6 digits, not already verified, and not currently verifying
    if (phoneOtp.length === 6 && !phoneVerified && !phoneVerifyingRef.current) {
      phoneVerifyingRef.current = true;
      setPhoneVerifying(true);
      setPhoneError(''); // Clear any previous errors
      
      const currentOtp = phoneOtp; // Capture current OTP value
      
      // Artificial delay for verification
      const timer = setTimeout(() => {
        // Fixed successful OTP: 123456
        if (currentOtp === '123456') {
          setPhoneVerifiedLocal(true);
          setPhoneVerified(true);
          setPhoneError('');
        } else {
          // Invalid OTP - show error and reset
          setPhoneError('Invalid OTP. Please try again.');
          setValue('phoneOtp', '');
          setTimeout(() => setPhoneError(''), 3000); // Clear error after 3 seconds
        }
        setPhoneVerifying(false);
        phoneVerifyingRef.current = false;
      }, 2000); // 2 second delay

      return () => {
        clearTimeout(timer);
        phoneVerifyingRef.current = false;
      };
    }
  }, [phoneOtp, phoneVerified, setPhoneVerified, setValue]);

  const handleResendEmail = () => {
    emailCountdown.start();
    setValue('emailOtp', '');
    setEmailVerifiedLocal(false);
    setEmailVerified(false);
    setEmailError('');
    setEmailVerifying(false);
    emailVerifyingRef.current = false;
    console.log('Resending email OTP to:', accountDetails?.workEmail);
  };

  const handleResendPhone = () => {
    phoneCountdown.start();
    setValue('phoneOtp', '');
    setPhoneVerifiedLocal(false);
    setPhoneVerified(false);
    setPhoneError('');
    setPhoneVerifying(false);
    phoneVerifyingRef.current = false;
    console.log('Resending phone OTP to:', accountDetails?.phoneNumber);
  };

  const handleNextStep = () => {
    if (emailVerified && phoneVerified) {
      navigate(ROUTES.ONBOARDING.TAX_VALIDATION);
    }
  };

  if (!accountDetails) {
    return (
      <OnboardingLayout currentStep={2}>
        <div className="space-y-6">
          <p className="text-text-secondary">Loading...</p>
        </div>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout currentStep={2}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">Verification</h2>
          <p className="text-text-secondary mt-2">
            Please verify your email and phone number with the codes we sent you
          </p>
        </div>

        <div className="space-y-6">
          {/* Email Verification */}
          {emailVerified ? (
            <Card className="bg-green-600/20 border-green-500/50">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-text-primary mb-2">
                  Email Verified
                </h3>
                <p className="text-text-secondary mb-6">
                  Your email address {accountDetails.workEmail} has been successfully confirmed.
                </p>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Verify Email Address
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Please enter the 6-digit code sent to {accountDetails.workEmail}
                  </p>
                </div>

                {emailVerifying ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="ml-3 text-text-secondary">Verifying...</span>
                  </div>
                ) : (
                  <OTPInput
                    length={6}
                    value={emailOtp}
                    onChange={(value) => {
                      setValue('emailOtp', value);
                      setEmailError(''); // Clear error when typing
                    }}
                    error={emailError || errors.emailOtp?.message}
                    disabled={emailVerifying}
                  />
                )}

                <div className="flex items-center justify-between">
                  {emailCountdown.isActive && emailCountdown.seconds > 0 ? (
                    <p className="text-sm text-text-secondary">
                      Code expires in {formatCountdown(emailCountdown.seconds)}
                    </p>
                  ) : (
                    <p className="text-sm text-text-secondary">Code expired</p>
                  )}
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    disabled={emailCountdown.isActive && emailCountdown.seconds > 0}
                    className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* Phone Verification */}
          {phoneVerified ? (
            <Card className="bg-green-600/20 border-green-500/50">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-text-primary mb-2">
                  Phone Verified
                </h3>
                <p className="text-text-secondary mb-6">
                  Your phone number {maskPhone(accountDetails.phoneCountry, accountDetails.phoneNumber)} has been successfully confirmed.
                </p>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Verify Phone Number
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Please enter the 6-digit code sent to{' '}
                    {maskPhone(accountDetails.phoneCountry, accountDetails.phoneNumber)}
                  </p>
                </div>

                {phoneVerifying ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="ml-3 text-text-secondary">Verifying...</span>
                  </div>
                ) : (
                  <OTPInput
                    length={6}
                    value={phoneOtp}
                    onChange={(value) => {
                      setValue('phoneOtp', value);
                      setPhoneError(''); // Clear error when typing
                    }}
                    error={phoneError || errors.phoneOtp?.message}
                    disabled={phoneVerifying}
                  />
                )}

                <div className="flex items-center justify-between">
                  {phoneCountdown.isActive && phoneCountdown.seconds > 0 ? (
                    <p className="text-sm text-text-secondary">
                      Code expires in {formatCountdown(phoneCountdown.seconds)}
                    </p>
                  ) : (
                    <p className="text-sm text-text-secondary">Code expired</p>
                  )}
                  <button
                    type="button"
                    onClick={handleResendPhone}
                    disabled={phoneCountdown.isActive && phoneCountdown.seconds > 0}
                    className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(ROUTES.ONBOARDING.ACCOUNT_DETAILS)}
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mx-auto"
                >
                  <Pencil size={14} />
                  Change phone number
                </button>
              </div>
            </Card>
          )}

          {/* Next Step Button - Only shown when both are verified */}
          {emailVerified && phoneVerified && (
            <div className="pt-4">
              <Button
                size="lg"
                className="w-full rounded-full"
                onClick={handleNextStep}
              >
                Next Step
              </Button>
            </div>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
};

