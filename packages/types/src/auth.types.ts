import type {
  RegisterSchema,
  LoginSchema,
} from "@colorie-track/schemas/authSchema";

export interface IAuth {
  register({ input }: { input: RegisterSchema }): Promise<void>;
  login({ input }: { input: LoginSchema }): Promise<void>;
  logout(): Promise<void>;
  normalizeEmail(email: string): string;
}
