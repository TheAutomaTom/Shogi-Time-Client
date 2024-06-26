import type { UserRole } from "./UserRole";

export type User = {
   id:number;     // in Sql
   guid: string;  // in Keycloak
   username: string;
   firstName: string;
   lastName: string;
   email: string;
   emailVerified: boolean;
   userRole: UserRole;
   enabled: boolean;
}