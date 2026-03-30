import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters"),
  email: z.email("Invalid email address"),
  onBoardingCompleted: z.boolean().default(false),
  dailyColorieTarget: z.number().min(1, "Daily target must be at least 1"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
