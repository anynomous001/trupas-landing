export interface AccountDetails {
  contactName: string;
  workEmail: string;
  phoneCountry: string;
  phoneNumber: string;
  businessName: string;
  websiteUrl: string;
  taxId: string;
  password: string;
}

export type TaxValidationStatus = 'idle' | 'loading' | 'success' | 'failed' | 'pending';

export interface VerificationState {
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface TaxValidationState {
  status: TaxValidationStatus;
}

