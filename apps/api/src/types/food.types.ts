import { IFoodModel } from "@/models/food.model";
import type {
  FoodAnalysisResult,
  SaveFoodEntryResult,
} from "@colorie-track/schemas/foodSchema";

export type ImageType = "model" | "base64";
export type ScanFoodReturn<T> = T extends "base64"
  ? FoodAnalysisResult & {
      imageBase64: string;
      imageUrl: string;
      storageKey: string;
    }
  : IFoodModel;

export interface IFood {
  scanFood<T extends ImageType>(
    file: Buffer,
    userId: string,
    type: T,
  ): Promise<ScanFoodReturn<T>>;
  optimizeImage(buffer: Buffer): Promise<Buffer>;
  uploadToR2(buffer: Buffer): Promise<{ url: string; key: string }>;
  analyzeFood(imageUrl: string): Promise<FoodAnalysisResult>;
  saveFoodEntry(
    input: SaveFoodEntryResult,
    userId: string,
  ): Promise<IFoodModel>;
  discardAnalyzedFood(storageKey: string): Promise<void>;
}
