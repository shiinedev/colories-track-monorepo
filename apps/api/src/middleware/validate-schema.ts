import { log } from "evlog";
import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";

export const validateSchema = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));
        log.error({
          errors,
        });
        return res.status(400).json({ errors });
      } else {
        log.error({
          error,
          message: error instanceof Error ? error.message : "validation error",
        });
        return res.status(500).json({ message: "internal server error" });
      }
    }
  };
};
