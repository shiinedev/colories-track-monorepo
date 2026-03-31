import { getMe, loginUser, registerUser } from "@/controller/auth.controller";
import { requireToken } from "@/middleware/auth";
import { validateSchema } from "@/middleware/validate-schema";
import { loginSchema, registerSchema } from "@calorie-track/schemas/authSchema";
import { Router } from "express";

const userRouter = Router();

userRouter.post("/register", validateSchema(registerSchema), registerUser);

userRouter.post("/login", validateSchema(loginSchema), loginUser);

userRouter.get("/me", requireToken, getMe);

export default userRouter;
