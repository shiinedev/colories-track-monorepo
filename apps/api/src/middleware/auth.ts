import User, { IUser } from "@/models/user.model";
import { verifyToken } from "@/utils/token";
import type { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const requireToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "no token provided" });
      }

      const decoded = verifyToken(token);

      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "no token provided" });
  }
};
