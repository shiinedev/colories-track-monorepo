import {
  saveFoodEntry,
  scanFood,
  ScanImage,
} from "@/controller/food.controller";
import { requireToken } from "@/middleware/auth";
import { upload } from "@/middleware/upload";
import { Router } from "express";

const foodRoutes = Router();

foodRoutes.post("/scan", requireToken, upload.single("image"), scanFood);
foodRoutes.post("scan-image", requireToken, upload.single("image"), ScanImage);
foodRoutes.post("/save", requireToken, saveFoodEntry);

export default foodRoutes;
