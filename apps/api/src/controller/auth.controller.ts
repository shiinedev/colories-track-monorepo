import { authService } from "@/services/auth.service";
import { LoginSchema, RegisterSchema } from "@/schema/auth.schema";
import type { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
  const input = (await req.body) as RegisterSchema;

  const user = await authService.register({ input });
  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      dailyColorieTarget: user.dailyColorieTarget,
      onBoardingCompleted: user.onBoardingCompleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const input = (await req.body) as LoginSchema;

  const { user, token } = await authService.login({ input });
  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      dailyColorieTarget: user.dailyColorieTarget,
      onBoardingCompleted: user.onBoardingCompleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token,
    },
  });
};

export const getMe = async (req: Request, res: Response) => {
  const user = req.user;
  res.status(200).json({
    message: "User retrieved successfully",
    user: {
      id: user?._id.toString(),
      username: user?.username,
      email: user?.email,
      dailyColorieTarget: user?.dailyColorieTarget,
      onBoardingCompleted: user?.onBoardingCompleted,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
    },
  });
};
