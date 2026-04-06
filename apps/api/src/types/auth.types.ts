import { IUser } from "../models/user.model.js";
import type { RegisterSchema, LoginSchema } from "../schema/auth.schema.js";

export interface IAuth {
  register({
    input,
  }: {
    input: RegisterSchema;
  }): Promise<Omit<IUser, "password">>;
  login({
    input,
  }: {
    input: LoginSchema;
  }): Promise<{ user: IUser; token: string }>;
  logout(): Promise<void>;
  normalizeEmail(email: string): string;
}
