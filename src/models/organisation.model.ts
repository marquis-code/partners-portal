/**
 * Represents the user types associated with a partner account
 * */
export type PartnerUserType = 'owner' | 'admin' | 'staff' | 'super-admin';

export interface Partner {
  id: number;
  company_name: string;
  created_at: Date;
  updated_at: Date;
  city_id: null;
  account_sid: string;
  mode: string;
  status: string;
  rc_number: null;
  years_of_experience: null;
  company_email: string;
  company_phone: string;
}

export interface OnboardingState {
  identity: 'completed' | 'submitted' | 'not-submitted' | 'failed' | null;
  address: 'completed' | 'submitted' | 'not-submitted' | 'failed' | null;
}

/**
 * Represents the organization a user is associated with.
 * */
export interface PartnerOrganization {
  id: number;
  account_sid: string;
  user_id: number;
  role: PartnerUserType;
  created_at: Date;
  updated_at: Date;
  partner: Partner;
  onboardingState: OnboardingState;
  supportedCities: any[];
}
