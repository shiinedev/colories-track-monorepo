import FoodModel from "@/models/food.model";
import {
  IDialyReportStats,
  IMealStats,
  IOverallStats,
  IReport,
} from "@/types/report.types";
import { log } from "evlog";
import { Types } from "mongoose";

export class ReportService implements IReport {
  async getDialyReport(
    userId: Types.ObjectId | string,
    date: Date | string = new Date(),
  ): Promise<IDialyReportStats> {
    const userIdObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    log.info({
      message: `Generating daily report for user ${userId} on ${startOfDay}`,
    });

    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    log.info({ message: `End of day: ${endOfDay}` });

    try {
      const [result] = await FoodModel.aggregate<{
        mealStats: IMealStats[];
        overallStats: IOverallStats[];
      }>([
        {
          $match: {
            userId: userIdObjectId,
            timestamp: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $facet: {
            // mealts stats
            mealStats: [
              {
                $group: {
                  _id: "$mealType",
                  totalEntries: { $sum: 1 },
                  totalCalories: { $sum: "$calories" },
                  totalProteins: { $sum: "$proteins" },
                  totalCarbs: { $sum: "$carbs" },
                  totalFat: { $sum: "$fat" },
                },
              },
            ],
            // overall stats
            overallStats: [
              {
                $group: {
                  _id: null,
                  totalEntries: { $sum: 1 },
                  totalCalories: { $sum: "$calories" },
                  totalProtein: { $sum: "$protein" },
                  totalCarbs: { $sum: "$carbs" },
                  totalFat: { $sum: "$fat" },
                },
              },
            ],
          },
        },
      ]);

      log.info({
        message: "Aggregation result",
        result: JSON.stringify(result),
      });

      // initialize summary with default values
      const summary: IDialyReportStats = {
        totalEntries: 0,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        mealBreakdown: {
          breakfast: {
            totalEntries: 0,
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
          },
          lunch: {
            totalEntries: 0,
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
          },
          dinner: {
            totalEntries: 0,
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
          },
          snack: {
            totalEntries: 0,
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
          },
        },
        marcos: {
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

      // overall stats

      if (result && result.overallStats.length > 0) {
        const overall = result.overallStats[0];
        log.info({
          message: "overall stats ",
          overall,
        });
        summary.totalEntries = overall?.totalEntries || 0;
        summary.totalCalories = overall?.totalCalories || 0;
        summary.totalProtein = overall?.totalProtein || 0;
        summary.totalCarbs = overall?.totalCarbs || 0;
        summary.totalFat = overall?.totalFat || 0;
      }

      log.info({
        message: "overAll summary",
        totalCalories: summary.totalCalories,
        totalProtein: summary.totalProtein,
        totalCarbs: summary.totalCarbs,
        totalFat: summary.totalFat,
        totalEntries: summary.totalEntries,
      });

      // meals stats
      result?.mealStats.map((meal) => {
        const mealTypeKey =
          meal._id as keyof IDialyReportStats["mealBreakdown"];

        if (summary.mealBreakdown[mealTypeKey]) {
          summary.mealBreakdown[mealTypeKey] = {
            totalEntries: meal.totalEntries,
            totalCalories: meal.totalCalories,
            totalProtein: meal.totalProtein,
            totalCarbs: meal.totalCarbs,
            totalFat: meal.totalFat,
          };
        }
      });

      log.info({
        message: "meal breakdown",
        mealBreakdown: summary.mealBreakdown,
      });

      // macro
      const caloriesFromProtein = summary.totalProtein * 4;
      const caloriesFromCarbs = summary.totalCarbs * 4;
      const caloriesFromFat = summary.totalFat * 9;
      const totalMacrosCalories =
        caloriesFromProtein + caloriesFromCarbs + caloriesFromFat;

      summary.marcos = {
        protein: {
          grams: summary.totalProtein,
          calories: caloriesFromProtein,
          percentage:
            totalMacrosCalories > 0
              ? Math.round((caloriesFromProtein / totalMacrosCalories) * 100)
              : 0,
        },
        carbs: {
          grams: summary.totalCarbs,
          calories: caloriesFromCarbs,
          percentage:
            totalMacrosCalories > 0
              ? Math.round((caloriesFromCarbs / totalMacrosCalories) * 100)
              : 0,
        },
        fat: {
          grams: summary.totalFat,
          calories: caloriesFromFat,
          percentage:
            totalMacrosCalories > 0
              ? Math.round((caloriesFromFat / totalMacrosCalories) * 100)
              : 0,
        },
      };

      log.info({
        message: "marcos",
        marcos: summary.marcos,
      });

      return summary;
    } catch (error) {
      log.error({
        message: "Failed to get daily report",
        error,
      });
      throw error;
    }
  }

  async getMonthlyReport(): Promise<void> {}

  async getYearlyReport(): Promise<void> {}
}

export const reportService = new ReportService();
