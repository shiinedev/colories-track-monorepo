import {
  saveFoodEntry,
  scanFood,
  analyzeImage,
  discardAnalyzedFood,
} from "../../controller/food.controller.js";
import { requireToken } from "../../middleware/auth.js";
import { upload } from "../../middleware/upload.js";
import { validateSchema } from "../../middleware/validate-schema.js";
import { saveFoodEntrySchema } from "../../schema/food.schema.js";
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
