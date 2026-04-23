import { IUser } from "../models/user.model.js";
import type {
  RegisterSchema,
  LoginSchema,
  UpdateUserSchema,
} from "../schema/auth.schema.js";

export interface IAuth {
  register({
    input,
  }: {
    input: RegisterSchema;
  }): Promise<{ user: Omit<IUser, "password">; token: string }>;
  login({
    input,
  }: {
    input: LoginSchema;
  }): Promise<{ user: IUser; token: string }>;
  updateProfile({ input }: { input: UpdateUserSchema }): Promise<void>;
  normalizeEmail(email: string): string;
}
