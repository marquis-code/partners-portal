import {LoginResponse, Token} from "@/models/login-response.model";
export type UserData = Omit<LoginResponse, 'token'>;

export interface UserSessionModel {
  user: UserData;
  token: Token;
  onboardComplete?: boolean;
  associatedOrganizations?: any[];
  activeContext?: any;
}
