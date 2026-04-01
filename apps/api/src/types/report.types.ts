import { Types } from "mongoose";
import {
  IBaseStats,
  IDailyReportStats,
  IMonthlyReportStats,
  IWeeklyReportStats,
  MacrosStats,
  MicrostatsKeys,
} from "@calorie-track/types/report.types.ts";

// export interface IBaseStats {
//   totalCalories: number;
//   totalProtein: number;
//   totalCarbs: number;
//   totalFat: number;
// }

// export interface IMealBreakdown extends IBaseStats {
//   count: number;
// }

// export interface IMealStats extends IMealBreakdown {
//   _id: string;
// }

// export interface IOverallStats extends IBaseStats {
//   _id: null;
//   totalEntries: number;
// }

// export interface IMacrosStats {
//   grams: number;
//   calories: number;
//   percentage: number;
// }

// export type MicrostatsKeys = "protein" | "carbs" | "fat";

// export type MacrosStats = Record<MicrostatsKeys, IMacrosStats>;

// export type IDailyStats = IMealStats;

// export interface IDailyReportStats extends IBaseStats {
//   totalEntries: number;
//   mealBreakdown: Record<MealType, IMealBreakdown>;
//   macros: MacrosStats;
// }

// export type DailyData = Record<string, IMealBreakdown>;

// export interface IWeeklyReportStats extends Omit<
//   IDailyReportStats,
//   "mealBreakdown"
// > {
//   dailyData: DailyData;
//   avgCalories: number;
// }

// export interface IWeekSummary extends IBaseStats {
//   date: string;
//   dayName: string;
//   goal: number;
//   consumed: number;
//   percentCompletd: number;
//   totalEntries: number;
// }
// export type DailyTotals = {
//   _id: string;
//   dayCalories: number;
// };

// export interface IMonthlyReportStats extends IWeeklyReportStats {
//   highestDay: number;
//   daysTracked: number;
// }

export type CalculateMacrosInput = Record<MicrostatsKeys, number>;

export type CalculateMacrosResult = {
  caloriesFromFat: number;
  caloriesFromCarbs: number;
  caloriesFromProtein: number;
  totalMacrosCalories: number;
};

export type PrepareMacrosInput = CalculateMacrosResult &
  Omit<IBaseStats, "totalCalories">;

export interface IReport {
  // 1. getDialyReport - returns a daily report of the user's activity
  getDialyReport(
    userId: Types.ObjectId | string,
    date: Date | string,
  ): Promise<IDailyReportStats>;

  // 2. getWeaklyReport - returns a weekly report of the user's activity
  getWeaklyReport(
    userId: Types.ObjectId | string,
    startDate: Date,
    endDate: Date,
  ): Promise<IWeeklyReportStats>;

  // 3. getMonthlyReport - returns a monthly report of the user's activity
  getMonthlyReport(
    userId: Types.ObjectId | string,
    startDate: Date,
    endDate: Date,
  ): Promise<IMonthlyReportStats>;

  // helper functions
  // 1. calculateMacros - calculates the calories from protein, carbs, and fat
  calculateMacros({
    protein,
    carbs,
    fat,
  }: CalculateMacrosInput): CalculateMacrosResult;
  // 2. calculatePercentage - calculates the percentage of a value out of a total
  calculatePercentage(value: number, total: number): number;
  // 3 prepareMacros data
  prepareMacros(input: PrepareMacrosInput): MacrosStats;
}
