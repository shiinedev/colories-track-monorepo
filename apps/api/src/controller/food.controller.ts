import { foodService } from "@/services/food.service";
import { log } from "evlog";
import type { Request, Response } from "express";

export const scanFood = async (req: Request, res: Response) => {
  const { file } = req;

  if (!file) {
    return res
      .status(400)
      .json({ error: "No file uploaded, please provide an image" });
  }

  log.info({ message: `user: ${req.user!}` });

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.user._id.toString();

  const result = await foodService.scanFood(file.buffer, userId, "base64");

  return res.status(200).json({
    message: "Food scanned successfully",
    result,
  });
};

export const ScanImage = async (req: Request, res: Response) => {
  const { file } = req;

  if (!file) {
    return res
      .status(400)
      .json({ error: "No file uploaded, please provide an image" });
  }

  log.info({ message: `user: ${req.user!}` });

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.user._id.toString();

  const result = await foodService.scanFood(file.buffer, userId, "base64");

  return res.status(200).json({
    message: "Food scanned successfully",
    result,
  });
};

export const saveFoodEntry = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.user._id.toString();

  const result = await foodService.saveFoodEntry(req.body, userId);

  return res.status(200).json({
    message: "Food entry saved successfully",
    result,
  });
};
