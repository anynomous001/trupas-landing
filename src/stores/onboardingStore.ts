import { create } from 'zustand';
import type { AccountDetails, TaxValidationStatus, VerificationState } from '../types/onboarding.types';

interface OnboardingState {
  // Step 1 data
  accountDetails: AccountDetails | null;

  // Step 2 data
  verification: VerificationState;

  // Step 3 data
  taxValidation: {
    status: TaxValidationStatus;
  };

  // Actions
  setAccountDetails: (data: AccountDetails) => void;
  setEmailVerified: (verified: boolean) => void;
  setPhoneVerified: (verified: boolean) => void;
  setTaxStatus: (status: TaxValidationStatus) => void;
  reset: () => void;
}

const initialState = {
  accountDetails: null,
  verification: {
    emailVerified: false,
    phoneVerified: false,
  },
  taxValidation: {
    status: 'idle' as TaxValidationStatus,
  },
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,
  setAccountDetails: (data) => set({ accountDetails: data }),
  setEmailVerified: (verified) =>
    set((state) => ({
      verification: { ...state.verification, emailVerified: verified },
    })),
  setPhoneVerified: (verified) =>
    set((state) => ({
      verification: { ...state.verification, phoneVerified: verified },
    })),
  setTaxStatus: (status) =>
    set({ taxValidation: { status } }),
  reset: () => set(initialState),
}));

