export type SignUpMode = 'individual' | 'company';

interface SignUpOption {
  mode: SignUpMode;
}

export type IndividualSignup = SignUpOption

export interface CompanySignup extends SignUpOption{
  company_name?: string;
  company_email?: string;
  company_phone?: string;
  rc_number?: string;
  years_of_experience?: string;
}
