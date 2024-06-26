import type { AuthCredential } from "./AuthCredential";
import type { User } from "./User";

export type AuthenticatedAccount = {
  AuthCredential: AuthCredential;
  User: User;

}