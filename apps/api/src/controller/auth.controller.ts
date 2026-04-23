import { authService } from "../services/auth.service.js";
import {
  LoginSchema,
  RegisterSchema,
  UpdateUserSchema,
} from "../schema/auth.schema.js";
import type { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
  const input = (await req.body) as RegisterSchema;

  const { user, token } = await authService.register({ input });
  res.status(201).json({
    message: "User registered successfully",
    user: {
      ...user,
      id: user._id.toString(),
      token,
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

export const updateUser = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const input = (await req.body) as UpdateUserSchema;
  await authService.updateProfile({ input, userId: user._id.toString() });
  res.status(200).json({
    message: "User updated successfully",
  });
};
