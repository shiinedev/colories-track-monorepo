import z from "zod";

export const MealTypeSchema = z.enum(["breakfast", "lunch", "dinner", "snack"]);

export const FoodAnalysisSchema = z.object({
  foodName: z.string().describe("The name of the food"),
  calories: z.number().describe("The cloorie intensity of the food"),
  fat: z.number().describe("The fat content of the food"),
  protein: z.number().describe("The protein content of the food"),
  carbs: z.number().describe("The carbohydrate content of the food"),
  mealType: MealTypeSchema.describe("The type of meal the food is for"),
});

// export type MealType = z.infer<typeof MealTypeSchema>;

export type FoodAnalysisResult = z.infer<typeof FoodAnalysisSchema>;

export const saveFoodEntrySchema = FoodAnalysisSchema.extend({
  storageKey: z.string().describe("The storage key for the food entry"),
});

export type SaveFoodEntryResult = z.infer<typeof saveFoodEntrySchema>;
