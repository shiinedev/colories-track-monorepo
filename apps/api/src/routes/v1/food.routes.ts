import {
  saveFoodEntry,
  scanFood,
  analyzeImage,
  discardAnalyzedFood,
} from "@/controller/food.controller";
import { requireToken } from "@/middleware/auth";
import { upload } from "@/middleware/upload";
import { validateSchema } from "@/middleware/validate-schema";
import { saveFoodEntrySchema } from "@/schema/food.schema";
import { Router } from "express";

const foodRoutes = Router();

foodRoutes.post("/scan", requireToken, upload.single("image"), scanFood);
foodRoutes.post("analyze", requireToken, upload.single("image"), analyzeImage);
foodRoutes.post(
  "/save",
  requireToken,
  validateSchema(saveFoodEntrySchema),
  saveFoodEntry,
);
foodRoutes.post("/discard", requireToken, discardAnalyzedFood);

export default foodRoutes;
