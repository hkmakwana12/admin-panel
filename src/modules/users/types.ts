/* ---------------------------------
   ENUMS (strongly recommended)
---------------------------------- */

export type UserRole = "admin" | "moderator" | "active";

export type UserStatus = "active" | "inactive" | "suspended";

/* ---------------------------------
   MODEL (what API returns)
   NEVER expose password here
---------------------------------- */

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

/* ---------------------------------
   CREATE / UPDATE payload
---------------------------------- */

export interface UserPayload {
  name: string;
  email: string;
  password?: string; // optional for update
  role: UserRole;
  status: UserStatus;
}
