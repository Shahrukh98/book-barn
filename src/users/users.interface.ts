import { UserRole } from "../auth/auth.guard";

export interface CreateUser {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}
