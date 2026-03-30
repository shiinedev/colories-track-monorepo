import { IUser } from "@/models/user.model";
import type {
  RegisterSchema,
  LoginSchema,
} from "@colorie-track/schemas/authSchema";

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
