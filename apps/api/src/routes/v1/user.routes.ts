import {
  getMe,
  loginUser,
  registerUser,
} from "../../controller/auth.controller.js";
import { requireToken } from "../../middleware/auth.js";
import { validateSchema } from "../../middleware/validate-schema.js";
import { loginSchema, registerSchema } from "../../schema/auth.schema.js";
import { Router } from "express";

const userRouter = Router();

userRouter.post("/register", validateSchema(registerSchema), registerUser);

userRouter.post("/login", validateSchema(loginSchema), loginUser);

userRouter.get("/me", requireToken, getMe);

export default userRouter;
