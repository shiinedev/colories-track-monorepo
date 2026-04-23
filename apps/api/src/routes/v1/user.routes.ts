import {
  getMe,
  loginUser,
  registerUser,
  updateUser,
} from "../../controller/auth.controller.js";
import { requireToken } from "../../middleware/auth.js";
import { validateSchema } from "../../middleware/validate-schema.js";
import {
  loginSchema,
  registerSchema,
  updateUserSchema,
} from "../../schema/auth.schema.js";
import { Router } from "express";

const userRoutes = Router();

userRoutes.post("/register", validateSchema(registerSchema), registerUser);

userRoutes.post("/login", validateSchema(loginSchema), loginUser);

userRoutes.get("/me", requireToken, getMe);
userRoutes.put(
  "/update",
  validateSchema(updateUserSchema),
  requireToken,
  updateUser,
);

export default userRoutes;
