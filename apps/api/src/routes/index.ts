import { Router } from "express";
import userRouter from "./v1/user.routes";
import foodRoutes from "./v1/food.routes";
import reportRoutes from "./v1/report.route";

const V1routes = Router();

V1routes.use("/auth", userRouter);
V1routes.use("/food", foodRoutes);
V1routes.use("/reports", reportRoutes);

export default V1routes;
