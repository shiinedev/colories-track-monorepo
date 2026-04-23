import {
  RegisterSchema,
  LoginSchema,
  UpdateUserSchema,
} from "../schema/auth.schema.js";
import User, { IUser } from "../models/user.model.js";
import { IAuth } from "../types/auth.types.js";
import { generateToken } from "../utils/token.js";
import { logger } from "../utils/logger.js";

export class AuthService implements IAuth {
  async register({
    input,
  }: {
    input: RegisterSchema;
  }): Promise<{ user: Omit<IUser, "password">; token: string }> {
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
        logger.info({
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

      const token = generateToken({ id: user._id.toString() });

      return {
        user,
        token,
      };
    } catch (error) {
      logger.error({
        message: "Failed to register user",
        cause: error,
      });
      throw new Error(`Failed to register user:${error}`);
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

  async updateProfile({
    input,
    userId,
  }: {
    input: UpdateUserSchema;
    userId: string;
  }): Promise<void> {
    const { username, dailyColorieTarget, onBoardingCompleted } = input;

    // check if the user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      logger.error({
        message: "User not found",
        cause: userId,
      });
      throw new Error("User not found", { cause: userId });
    }

    const user = await User.updateOne(
      { _id: existingUser._id },
      {
        username,
        dailyColorieTarget,
        onBoardingCompleted,
      },
    );
  }
  normalizeEmail(email: string): string {
    return email.toLowerCase();
  }
}

export const authService = new AuthService();
