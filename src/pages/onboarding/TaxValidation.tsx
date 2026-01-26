import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, Clock, RefreshCw, FileText, AlertTriangle, ArrowRight, FileCheck, Briefcase, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { ROUTES } from '../../config/routes';
import type { TaxValidationStatus } from '../../types/onboarding.types';

// Reusable "Why is this happening?" section component
const WhyThisMattersSection = (): JSX.Element => {
  return (
    <div className="space-y-6 pt-8 border-t border-gray-200 dark:border-gray-800">
      <div>
        <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full mb-4">
          WHY THIS MATTERS
        </span>
        <h3 className="text-2xl font-bold text-text-primary mb-4">
          Why is this happening?
        </h3>
        <p className="text-text-secondary">
          TruePas is strictly required to verify business entities for security and federal compliance. This ensures that only legitimate businesses can process instant check-ins and access sensitive identity data.
        </p>
      </div>

      {/* Reasons */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Reason 1: Legal Compliance */}
        <div className="space-y-3">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <FileCheck className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold text-text-primary">Legal Compliance</h4>
          <p className="text-sm text-text-secondary">
            We must validate EINs against IRS records to prevent fraud.
          </p>
        </div>

        {/* Reason 2: Exact Match Required */}
        <div className="space-y-3">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold text-text-primary">Exact Match Required</h4>
          <p className="text-sm text-text-secondary">
            The business name must match exactly what appears on your SS-4 letter.
          </p>
        </div>

        {/* Reason 3: New EIN Issuance */}
        <div className="space-y-3">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold text-text-primary">New EIN Issuance?</h4>
          <p className="text-sm text-text-secondary">
            Newly issued EINs can take up to 2 weeks to appear in our verification databases.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-800"></div>

      {/* Resources */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
          Resources
        </h4>
        <div className="space-y-3">
          <a
            href="#"
            className="flex items-center justify-between text-primary hover:underline group"
          >
            <span>How to find your SS-4 Letter</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#"
            className="flex items-center justify-between text-primary hover:underline group"
          >
            <span>Common verification errors</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export const TaxValidation = (): JSX.Element => {
  const navigate = useNavigate();
  const accountDetails = useOnboardingStore((state) => state.accountDetails);
  const setAccountDetails = useOnboardingStore((state) => state.setAccountDetails);
  const taxStatus = useOnboardingStore((state) => state.taxValidation.status);
  const setTaxStatus = useOnboardingStore((state) => state.setTaxStatus);

  const [localStatus, setLocalStatus] = useState<TaxValidationStatus>(taxStatus);
  const [showDialog, setShowDialog] = useState(false);
  const [newTaxId, setNewTaxId] = useState('');

  // Redirect if no account details
  useEffect(() => {
    if (!accountDetails) {
      navigate(ROUTES.ONBOARDING.ACCOUNT_DETAILS);
    }
  }, [accountDetails, navigate]);

  // Simulate tax validation - always start fresh when component mounts
  useEffect(() => {
    if (!accountDetails) return;

    // Always reset to idle first, then start validation
    setLocalStatus('idle');
    setTaxStatus('idle');
    
    // Start loading immediately
    const startTimer = setTimeout(() => {
      setLocalStatus('loading');
      setTaxStatus('loading');
    }, 50);

    // Complete validation after 3 seconds
    const completeTimer = setTimeout(() => {
      // Fixed valid tax ID: 123456
      if (accountDetails.taxId === '123456') {
        setLocalStatus('success');
        setTaxStatus('success');
      } else {
        setLocalStatus('failed');
        setTaxStatus('failed');
        setShowDialog(true);
      }
    }, 3050);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(completeTimer);
    };
  }, [accountDetails, setTaxStatus]); // Re-run when accountDetails changes

  const handleRetry = () => {
    setLocalStatus('idle');
    setTaxStatus('idle');
    setShowDialog(false);
  };

  const handleUpdateTaxId = () => {
    if (!accountDetails) return;
    
    if (newTaxId.trim()) {
      // Update tax ID in store
      setAccountDetails({
        ...accountDetails,
        taxId: newTaxId.trim(),
      });
      setShowDialog(false);
      setNewTaxId('');
      // Trigger re-validation
      setLocalStatus('idle');
      setTaxStatus('idle');
    }
  };

  if (!accountDetails) {
    return (
      <OnboardingLayout currentStep={3}>
        <div className="space-y-8">
          <p className="text-text-secondary">Loading...</p>
        </div>
      </OnboardingLayout>
    );
  }

  const renderContent = () => {
    switch (localStatus) {
      case 'loading':
        return (
          <Card className="text-center py-12">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Validating Tax ID
            </h3>
            <p className="text-text-secondary">
              Validating Tax ID: {accountDetails.taxId}
            </p>
          </Card>
        );

      case 'success':
        return (
          <Card className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-text-primary mb-2">
              Tax ID Validated Successfully!
            </h3>
            <p className="text-text-secondary mb-6">
              Your tax ID has been verified and your account is ready to proceed.
            </p>
            <Button size="lg" className="rounded-full" onClick={() => navigate(ROUTES.DASHBOARD)}>
              Continue to Dashboard
            </Button>
          </Card>
        );

      case 'failed':
        return (
          <div className="text-center space-y-6">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <div>
              <h3 className="text-2xl font-semibold text-text-primary mb-2">
                Tax ID Validation Unsuccessful
              </h3>
              <p className="text-text-secondary">
                There was an issue verifying your business information.
              </p>
            </div>

            {/* Error Message Box */}
            <div className="bg-card border-l-4 border-red-500 rounded-lg p-6 text-left">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-text-primary mb-2">Verification Error</h4>
                  <p className="text-text-secondary text-sm">
                    Tax ID is not associated with an active business entity. Please ensure your EIN matches the exact legal business name in IRS records.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleRetry}
                size="lg"
                className="flex items-center gap-2 rounded-full"
              >
                <RefreshCw size={18} />
                Retry Verification
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(ROUTES.ONBOARDING.ACCOUNT_DETAILS)}
                size="lg"
                className="flex items-center gap-2 rounded-full"
              >
                <FileText size={18} />
                Enter Different Tax ID
              </Button>
            </div>

            {/* Support Link */}
            <p className="text-sm text-text-secondary">
              Need help regarding this error?{' '}
              <a href="#" className="text-primary hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        );

      case 'pending':
        return (
          <Card className="text-center py-12">
            <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-text-primary mb-2">
              Under Manual Review
            </h3>
            <p className="text-text-secondary mb-6">
              Your tax ID is under manual review. We'll notify you once the verification is complete.
            </p>
            <Button size="lg" className="rounded-full" onClick={() => navigate(ROUTES.HOME)}>
              Return to Dashboard
            </Button>
          </Card>
        );

      default:
        // Show loading as default while initializing
        return (
          <Card className="text-center py-12">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Validating Tax ID
            </h3>
            <p className="text-text-secondary">
              Validating Tax ID: {accountDetails.taxId}
            </p>
          </Card>
        );
    }
  };

  return (
    <>
      <OnboardingLayout currentStep={3}>
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-text-primary">Tax ID Validation</h2>
            <p className="text-text-secondary mt-2">
              We're verifying your business tax identification number
            </p>
          </div>

          {renderContent()}

          {/* Why is this happening Section - Always at the bottom */}
          <WhyThisMattersSection />
        </div>
      </OnboardingLayout>

      {/* Dialog for re-entering Tax ID */}
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        title="Re-enter Tax ID"
      >
        <div className="space-y-6">
          <div className="bg-card border-l-4 border-red-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-text-primary mb-1">Tax ID Validation Failed</h4>
                <p className="text-sm text-text-secondary">
                  The tax ID "{accountDetails?.taxId}" could not be verified. Please enter a valid Tax ID to continue.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Business Tax ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="XX-XXXXXXX or 123456"
                className="pl-10"
                value={newTaxId}
                onChange={(e) => setNewTaxId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdateTaxId();
                  }
                }}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            </div>
            <p className="text-xs text-text-secondary">
              Enter a valid Tax ID / EIN to proceed with verification.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              className="rounded-full"
              onClick={() => {
                setShowDialog(false);
                setNewTaxId('');
              }}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full"
              onClick={handleUpdateTaxId}
              disabled={!newTaxId.trim()}
            >
              Update & Retry
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

