import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function generateToken({ id }: { id: string }): string {
  if (!id) {
    throw new Error("id is required");
  }

  if (!env.jwt.SECRET || !env.jwt.EXPIRES_IN) {
    throw new Error("JWT_SECRET and JWT_EXPIRES_IN are not defined");
  }
  return jwt.sign({ id }, env.jwt.SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): { id: string } {
  if (!env.jwt.SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.verify(token, env.jwt.SECRET) as { id: string };
}
