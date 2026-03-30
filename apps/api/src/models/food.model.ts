import type { MealType } from "@colorie-track/schemas/foodSchema";
import { Document, model, Schema, Types } from "mongoose";

export interface IFoodModel extends Document {
  userId: Types.ObjectId;
  foodname: string;
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
  mealType: MealType;
  timestamp: Date;
  imageURl: string;
  storageKey: string;
}

const foodSchema = new Schema<IFoodModel>(
  {
    userId: { type: Types.ObjectId, required: true, ref: "User" },
    foodname: { type: String, required: true },
    calories: { type: Number, required: true },
    fat: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    mealType: { type: String, required: true },
    timestamp: { type: Date, required: true },
    imageURl: { type: String, required: true },
    storageKey: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

foodSchema.index({ userId: 1, timestamp: -1 });

const FoodModel = model<IFoodModel>("Food", foodSchema);
export default FoodModel;
