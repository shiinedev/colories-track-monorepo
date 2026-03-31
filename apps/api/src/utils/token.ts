import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function generateToken({ id }: { id: string }): string {
  if (!id) {
    throw new Error("id is required");
  }

  if (!env.JWT_SECRET || !env.JWT_EXPIRES_IN) {
    throw new Error("JWT_SECRET and JWT_EXPIRES_IN are not defined");
  }
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): { id: string } {
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.verify(token, env.JWT_SECRET) as { id: string };
}
