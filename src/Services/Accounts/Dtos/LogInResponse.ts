import { User } from "../AuthenticatedAccount/User";

export type LogInResponse = {
  User: User;
  AccessToken: string;
  RefreshToken: string;
  AuthUserId: string;
  // Roles: string[];  

}