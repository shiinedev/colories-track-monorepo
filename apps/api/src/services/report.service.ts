import FoodModel from "@/models/food.model";
import {
  DailyData,
  DailyTotals,
  IDailyStats,
  IDailyReportStats,
  IMealStats,
  IMonthlyReportStats,
  IOverallStats,
  IWeeklyReportStats,
  MacrosStats,
} from "@calorie-track/types/report.types.ts";
import {
  CalculateMacrosInput,
  CalculateMacrosResult,
  IReport,
  PrepareMacrosInput,
} from "@/types/report.types";
import { initilDailySummary } from "@/utils/constants";
import { log } from "evlog";
import { Types } from "mongoose";

export class ReportService implements IReport {
  private readonly match = (
    id: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ) => {
    return {
      userId: id,
      timestamp: { $gte: startDate, $lte: endDate },
    };
  };

  private readonly dailyStatsGroup = {
    _id: {
      $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
    },
    count: { $sum: 1 },
    totalCalories: { $sum: "$calories" },
    totalFat: { $sum: "$fat" },
    totalCarbs: { $sum: "$carbs" },
    totalProtein: { $sum: "$protein" },
  };

  private readonly overallStatsGroup = {
    _id: null,
    totalEntries: { $sum: 1 },
    totalCalories: { $sum: "$calories" },
    totalProtein: { $sum: "$protein" },
    totalCarbs: { $sum: "$carbs" },
    totalFat: { $sum: "$fat" },
  };

  async getDialyReport(
    userId: Types.ObjectId | string,
    date: Date | string = new Date(),
  ): Promise<IDailyReportStats> {
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
          $match: this.match(userIdObjectId, startOfDay, endOfDay),
        },
        {
          $facet: {
            // mealts stats
            mealStats: [
              {
                $group: {
                  _id: "$mealType",
                  count: { $sum: 1 },
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
                $group: this.overallStatsGroup,
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
      const summary = initilDailySummary;

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
          meal._id as keyof IDailyReportStats["mealBreakdown"];

        if (summary.mealBreakdown[mealTypeKey]) {
          summary.mealBreakdown[mealTypeKey] = {
            count: meal.count,
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
      const {
        caloriesFromProtein,
        caloriesFromCarbs,
        caloriesFromFat,
        totalMacrosCalories,
      } = this.calculateMacros({
        protein: summary.totalProtein,
        carbs: summary.totalCarbs,
        fat: summary.totalFat,
      });

      summary.macros = this.prepareMacros({
        caloriesFromProtein,
        totalProtein: summary.totalProtein,
        caloriesFromCarbs,
        totalCarbs: summary.totalCarbs,
        caloriesFromFat,
        totalFat: summary.totalFat,
        totalMacrosCalories,
      });

      log.info({
        message: "macros",
        macros: summary.macros,
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

  async getWeaklyReport(
    userId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ): Promise<IWeeklyReportStats> {
    try {
      log.info({
        message: "getWeaklyReport Input Date",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        userId: userId.toHexString(),
      });

      // result
      const [result] = await FoodModel.aggregate<{
        dailyStats: IDailyStats[];
        overallStats: IOverallStats[];
      }>([
        {
          $match: this.match(userId, startDate, endDate),
        },
        {
          $facet: {
            dailyStats: [
              {
                $group: this.dailyStatsGroup,
              },
              {
                $sort: { _id: 1 },
              },
            ],

            overallStats: [
              {
                $group: this.overallStatsGroup,
              },
            ],
          },
        },
      ]);

      log.info({
        message: "Successfully fetched monthly report",
        result,
      });

      // Convert dailyStats to a map for easier access
      const dailyData: DailyData = {};

      result?.dailyStats.forEach((day) => {
        dailyData[day._id] = {
          count: day.count || 0,
          totalCalories: day.totalCalories || 0,
          totalFat: day.totalFat || 0,
          totalCarbs: day.totalCarbs || 0,
          totalProtein: day.totalProtein || 0,
        };
      });

      log.info({
        message: "Daily data",
        dailyData,
      });

      // Get overall stats
      const overallStats = result?.overallStats[0] || {
        totalEntries: 0,
        totalCalories: 0,
        totalFat: 0,
        totalCarbs: 0,
        totalProtein: 0,
      };

      log.info({
        message: "Overall stats",
        overallStats,
      });

      // calculate Macros
      const {
        caloriesFromProtein,
        caloriesFromCarbs,
        caloriesFromFat,
        totalMacrosCalories,
      } = this.calculateMacros({
        protein: overallStats.totalProtein,
        carbs: overallStats.totalCarbs,
        fat: overallStats.totalFat,
      });

      const macros = this.prepareMacros({
        caloriesFromProtein,
        totalProtein: overallStats.totalProtein,
        caloriesFromCarbs,
        totalCarbs: overallStats.totalCarbs,
        caloriesFromFat,
        totalFat: overallStats.totalFat,
        totalMacrosCalories,
      });

      log.info({
        message: "Macros",
        macros,
      });

      // avarage
      const avgCalories = this.calculatePercentage(
        result?.dailyStats?.length! || 0,
        overallStats.totalCalories,
      );

      log.info({
        message: "Average calories",
        avgCalories,
      });

      return {
        avgCalories,
        macros,
        ...overallStats,
        dailyData,
      };
    } catch (error) {
      log.error({
        message: "Failed to get monthly report",
        error,
      });
      throw error;
    }
  }

  async getMonthlyReport(
    userId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ): Promise<IMonthlyReportStats> {
    try {
      const [result] = await FoodModel.aggregate<{
        dailyStats: IDailyStats[];
        overallStats: IOverallStats[];
        dailyTotals: DailyTotals[];
      }>([
        {
          $match: this.match(userId, startDate, endDate),
        },
        {
          $facet: {
            dailyStats: [
              {
                $group: this.dailyStatsGroup,
              },
              {
                $sort: {
                  _id: 1,
                },
              },
            ],
            overallStats: [
              {
                $group: this.overallStatsGroup,
              },
            ],
            dailyTotals: [
              {
                $group: {
                  _id: { $dayOfMonth: "$timestamp" },
                  dayCalories: { $sum: "$calories" },
                },
              },
              {
                $sort: { dayCalories: -1 },
              },
              {
                $limit: 1,
              },
            ],
          },
        },
      ]);

      log.info({
        message: "all stats result",
        result,
      });

      // daily stats
      const dailyData: DailyData = {};

      result?.dailyStats?.forEach((day) => {
        dailyData[day._id] = {
          totalCalories: day.totalCalories || 0,
          totalProtein: day.totalProtein || 0,
          totalCarbs: day.totalCarbs || 0,
          totalFat: day.totalFat || 0,
          count: day.count || 0,
        };
      });

      log.info({
        message: "daily stats report",
        dailyData,
      });

      // overallStats
      const overallStats = result?.overallStats[0] || {
        totalEntries: 0,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
      };

      log.info({
        message: "overall stats",
        overallStats,
      });

      // calculte macros
      const {
        caloriesFromCarbs,
        caloriesFromFat,
        caloriesFromProtein,
        totalMacrosCalories,
      } = this.calculateMacros({
        protein: overallStats?.totalProtein,
        carbs: overallStats?.totalCarbs,
        fat: overallStats?.totalFat,
      });

      const macros = this.prepareMacros({
        caloriesFromProtein,
        totalProtein: overallStats.totalProtein,
        caloriesFromCarbs,
        totalCarbs: overallStats.totalCarbs,
        caloriesFromFat,
        totalFat: overallStats.totalFat,
        totalMacrosCalories,
      });

      log.info({
        message: "macros data",
        macros,
      });

      // calculae dailyStats
      const daysTracked = result?.dailyTotals?.length || 0;

      log.info({
        message: "days tracked",
        daysTracked,
      });

      // AvrageCarbs

      const avgCalories = this.calculatePercentage(
        daysTracked,
        overallStats.totalCalories,
      );

      log.info({
        message: "avrageCalories",
        avgCalories,
      });

      // hights day

      const highestDay = result?.dailyTotals[0]?.dayCalories || 0;

      log.info({
        message: "highest day calories",
        highestDay,
      });

      return {
        ...overallStats,
        highestDay,
        daysTracked,
        dailyData,
        avgCalories,
        macros,
      };
    } catch (error) {
      log.info({
        messgae: "failed getting monthly report",
        error,
      });

      throw error;
    }
  }

  prepareMacros({
    totalProtein,
    caloriesFromProtein,
    totalMacrosCalories,
    totalCarbs,
    caloriesFromCarbs,
    totalFat,
    caloriesFromFat,
  }: PrepareMacrosInput): MacrosStats {
    return {
      protein: {
        grams: totalProtein,
        calories: caloriesFromProtein,
        percentage: this.calculatePercentage(
          caloriesFromProtein,
          totalMacrosCalories,
        ),
      },
      carbs: {
        grams: totalCarbs,
        calories: caloriesFromCarbs,
        percentage: this.calculatePercentage(
          caloriesFromCarbs,
          totalMacrosCalories,
        ),
      },
      fat: {
        grams: totalFat,
        calories: caloriesFromFat,
        percentage: this.calculatePercentage(
          caloriesFromFat,
          totalMacrosCalories,
        ),
      },
    };
  }

  calculateMacros({
    protein,
    carbs,
    fat,
  }: CalculateMacrosInput): CalculateMacrosResult {
    const caloriesFromProtein = protein * 4;
    const caloriesFromCarbs = carbs * 4;
    const caloriesFromFat = fat * 9;
    const totalMacrosCalories =
      caloriesFromProtein + caloriesFromCarbs + caloriesFromFat;
    return {
      caloriesFromProtein,
      caloriesFromCarbs,
      caloriesFromFat,
      totalMacrosCalories,
    };
  }

  calculatePercentage(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }
}

export const reportService = new ReportService();
