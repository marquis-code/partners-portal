/* eslint-disable */
export interface LoginResponse {
  id: number;
  corporate_id: number;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  active: string;
  avatar: any;
  code: string;
  created_at: Date;
  updated_at: Date;
  gender: string;
  dob: Date;
  car_owner: string;
  nfc_id: any;
  staff_id: any;
  client_id: any;
  location: any;
  verified_at: any;
  city_id: any;
  login_remote_address: string;
  login_date_time: Date;
  login_is_successful: number;
  blocked_reason: any;
  is_blocked: number;
  blocked_at: any;
  sign_up_source: any;
  country_code: string;
  phone_verified_at: any;
  deleted_at: any;
  delete_reason: any;
  userType: any;
  token: Token;
  wallet: Wallet;
  routes: any[];
  isGuest: boolean;
}

export interface Token {
  iat: number;
  exp: number;
  token: string;
}

export interface Wallet {
  id: number;
  user_id: number;
  amount: string;
  created_at: Date;
  updated_at: Date;
  credit_amount: string;
  is_migrated_to_credit_system: number;
  main_balance: string;
}
