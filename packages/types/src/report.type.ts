import { MealType } from "@calorie-track/schemas/foodSchema";

export interface IBaseStats {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface IMealBreakdown extends IBaseStats {
  count: number;
}

export interface IMealStats extends IMealBreakdown {
  _id: string;
}

export interface IOverallStats extends IBaseStats {
  _id: null;
  totalEntries: number;
}

export interface IMacrosStats {
  grams: number;
  calories: number;
  percentage: number;
}

export type MicrostatsKeys = "protein" | "carbs" | "fat";

export type MacrosStats = Record<MicrostatsKeys, IMacrosStats>;

export type IDailyStats = IMealStats;

export interface IDailyReportStats extends IBaseStats {
  totalEntries: number;
  mealBreakdown: Record<MealType, IMealBreakdown>;
  macros: MacrosStats;
}

export type DailyData = Record<string, IMealBreakdown>;

export interface IWeeklyReportStats extends Omit<
  IDailyReportStats,
  "mealBreakdown"
> {
  dailyData: DailyData;
  avgCalories: number;
}

export interface IWeekSummary extends IBaseStats {
  date: string;
  dayName: string;
  goal: number;
  consumed: number;
  percentCompletd: number;
  totalEntries: number;
}
export type DailyTotals = {
  _id: string;
  dayCalories: number;
};

export interface IMonthlyReportStats extends IWeeklyReportStats {
  highestDay: number;
  daysTracked: number;
}
