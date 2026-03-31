import { Router } from "express";
import { requireToken } from "@/middleware/auth";
import { getDailyReport } from "@/controller/report.controller";

export const reportRoutes = Router();

reportRoutes.get("/daily", requireToken, getDailyReport);
reportRoutes.get("/monthly", requireToken);
reportRoutes.get("/yearly", requireToken);

export default reportRoutes;
