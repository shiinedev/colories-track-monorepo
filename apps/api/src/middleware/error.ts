import { env } from "@/config/env";
import type { Request, Response } from "express";

export const errorHandler = (err: Error, req: Request, res: Response) => {
  res.status(500).json({
    message: err.message,
    stack: env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
