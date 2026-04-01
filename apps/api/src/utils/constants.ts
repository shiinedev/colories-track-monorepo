import { IDailyReportStats } from "@calorie-track/types/report.types.ts";

export const initilDailySummary: IDailyReportStats = {
  totalEntries: 0,
  totalCalories: 0,
  totalProtein: 0,
  totalCarbs: 0,
  totalFat: 0,
  mealBreakdown: {
    breakfast: {
      count: 0,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
    },
    lunch: {
      count: 0,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
    },
    dinner: {
      count: 0,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
    },
    snack: {
      count: 0,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
    },
  },
  macros: {
    protein: {
      grams: 0,
      calories: 0,
      percentage: 0,
    },
    carbs: {
      grams: 0,
      calories: 0,
      percentage: 0,
    },
    fat: {
      grams: 0,
      calories: 0,
      percentage: 0,
    },
  },
};
