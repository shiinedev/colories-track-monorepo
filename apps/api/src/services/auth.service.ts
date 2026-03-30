import { RegisterSchema, LoginSchema } from "@colorie-track/schemas/authSchema";
import User, { IUser } from "../models/user.model";
import { IAuth } from "../types/auth.types";
import { log } from "evlog";
import { generateToken } from "@/utils/token";

export class AuthService implements IAuth {
  async register({
    input,
  }: {
    input: RegisterSchema;
  }): Promise<Omit<IUser, "password">> {
    const {
      email,
      password,
      dailyColorieTarget,
      onBoardingCompleted,
      username,
    } = input;

    const normalizedEmail = this.normalizeEmail(email);
    try {
      // check if user already exists
      const existingUser = await User.findOne({
        email: normalizedEmail,
      }).select("-password");

      if (existingUser) {
        log.info({
          message: "User already exists",
          email: existingUser.email,
        });
        throw new Error("User already exists", {
          cause: existingUser.email,
        });
      }

      const user = await User.create({
        email: normalizedEmail,
        password,
        dailyColorieTarget,
        onBoardingCompleted,
        username,
      });

      return user;
    } catch (error) {
      log.error({
        message: "Failed to register user",
        cause: error,
      });
      throw new Error("Failed to register user", { cause: error });
    }
  }

  async login({
    input,
  }: {
    input: LoginSchema;
  }): Promise<{ user: IUser; token: string }> {
    const { email, password } = input;

    const normalizedEmail = this.normalizeEmail(email);

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      throw new Error("Invalid credentials", { cause: email });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid password", { cause: email });
    }

    const token = generateToken({ id: user._id.toString() });

    return {
      user,
      token,
    };
  }

  async logout(): Promise<void> {}

  normalizeEmail(email: string): string {
    return email.toLowerCase();
  }
}

export const authService = new AuthService();
