export interface PartnerResponse {
  id?: number;
  company_name?: string;
  created_at?: Date;
  updated_at?: Date;
  city_id?: null;
  account_sid?: string;
  mode?: string;
  status?: string;
  rc_number?: null;
  years_of_experience?: null;
  company_email?: string;
  company_phone?: string;
  owner?: Owner;
}

export interface Owner {
  id?: number;
  corporate_id?: null;
  fname?: string;
  lname?: string;
  email?: string;
  phone?: string;
  password?: string;
  active?: string;
  avatar?: null;
  code?: string;
  created_at?: Date;
  updated_at?: Date;
  gender?: null;
  dob?: null;
  car_owner?: string;
  nfc_id?: null;
  staff_id?: null;
  client_id?: null;
  location?: null;
  verified_at?: null;
  city_id?: number;
  login_remote_address?: string;
  login_date_time?: Date;
  login_is_successful?: number;
  blocked_reason?: null;
  is_blocked?: number;
  blocked_at?: null;
  sign_up_source?: string;
  country_code?: string;
  phone_verified_at?: null;
  deleted_at?: null;
  delete_reason?: null;
  is_email_notification_enabled?: number;
  userType?: null;
  iat?: number;
  exp?: number;
  isGuest?: boolean;
}
