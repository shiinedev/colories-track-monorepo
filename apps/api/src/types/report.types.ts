import { Types } from "mongoose";

export interface IBaseStats {
  totalEntries: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface IMealStats extends IBaseStats {
  _id: string;
}

export interface IOverallStats extends IBaseStats {
  _id: null;
}

export interface IMarcosStats {
  grams: number;
  calories: number;
  percentage: number;
}

export type MacrosStats = {
  protein: IMarcosStats;
  carbs: IMarcosStats;
  fat: IMarcosStats;
};

export interface IDialyReportStats extends IBaseStats {
  mealBreakdown: {
    breakfast: IBaseStats;
    lunch: IBaseStats;
    dinner: IBaseStats;
    snack: IBaseStats;
  };
  marcos: MacrosStats;
}

export interface IReport {
  getDialyReport(
    userId: Types.ObjectId | string,
    date: Date | string,
  ): Promise<IDialyReportStats>;
  getMonthlyReport(): Promise<void>;
  getYearlyReport(): Promise<void>;
}
