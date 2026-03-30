import type { Request, Response } from "express";

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    message: `route ${req.method} ${req.path} not found`,
    method: req.method,
    path: req.path,
  });
};
