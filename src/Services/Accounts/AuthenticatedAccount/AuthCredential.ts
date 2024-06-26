import type { AuthToken } from "./AuthToken";

export type AuthCredential = {
  accessToken: AuthToken;
  refreshToken: AuthToken;
  authUserId: string;
  roles: string[];
}
