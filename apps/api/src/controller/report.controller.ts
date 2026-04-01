import { reportService } from "@/services/report.service";
import { log } from "evlog";
import type { Request, Response } from "express";
import {
  subDays,
  addDays,
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  parseISO,
} from "date-fns";
import { IWeekSummary } from "@/types/report.types";

export const getDailyReport = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { date } = req.query;

  const today = date ? new Date(date as string) : new Date();

  try {
    const summary = await reportService.getDialyReport(req.user._id, today);

    const remainingCalories =
      req.user.dailyColorieTarget - summary.totalCalories;

    const completedCalories = Math.round(
      (summary.totalCalories / req.user.dailyColorieTarget) * 100,
    );

    res.status(200).json({
      message: "Daily report retrieved successfully",
      goal: req.user.dailyColorieTarget,
      consumed: summary.totalCalories,
      remaining: remainingCalories > 0 ? remainingCalories : 0,
      completedCalories,
      totalEntries: summary.totalEntries,
      mealBreakdown: summary.mealBreakdown,
      macros: summary.macros,
    });
  } catch (error) {
    log.error({
      message: "Failed to get daily report",
      error,
    });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWeeklyReport = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const today = new Date();
  today.setHours(23, 59, 59, 599);
  const startedDate = subDays(new Date().setHours(0, 0, 0, 0), 6);
  const endDate = today;

  log.info({
    message: "getWeeklyReport Input Date from controller",
    startedDate: startedDate.toISOString(),
    endDate: endDate.toISOString(),
    userId: req.user._id.toString(),
  });

  try {
    const {
      avgCalories,
      dailyData,
      macros,
      totalCalories,
      totalCarbs,
      totalEntries,
      totalFat,
      totalProtein,
    } = await reportService.getWeaklyReport(req.user._id, startedDate, endDate);

    const weekSummary: IWeekSummary[] = [];

    // calculate summary by week

    for (let i = 0; i < 7; i++) {
      const dateStr = format(addDays(startedDate, i), "yyyy-MM-dd");
      const dayName = format(dateStr, "EE");

      const { count, totalCalories, totalCarbs, totalFat, totalProtein } =
        dailyData[dateStr] || {
          totalCalories: 0,
          totalCarbs: 0,
          totalFat: 0,
          totalProtein: 0,
          count: 0,
        };

      weekSummary.push({
        date: dateStr,
        dayName,
        consumed: totalCalories,
        totalCarbs,
        totalCalories,
        totalEntries: count,
        totalFat,
        totalProtein,
        goal: req.user.dailyColorieTarget,
        percentCompletd: reportService.calculatePercentage(
          req.user.dailyColorieTarget,
          totalCalories,
        ),
      });
    }

    res.status(200).json({
      message: "Weekly report retrieved successfully",
      week: weekSummary,
      macros,
      totalCalories,
      totalCarbs,
      totalEntries,
      totalFat,
      totalProtein,
      avgCalories,
    });
  } catch (error) {
    log.error({
      message: "Failed to get weekly report",
      error,
    });
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMonthlyReport = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const today = new Date();
  const year = req.query.year
    ? parseInt(req.query.year as string)
    : today.getFullYear();
  const month = req.query.month
    ? parseInt(req.query.month as string)
    : today.getMonth() + 1;

  const targetDate = new Date(year, month - 1, 1);

  const endDate = endOfMonth(targetDate.setHours(23, 59, 59, 599));
  const startedDate = startOfMonth(targetDate.setHours(0, 0, 0, 0));

  log.info({
    message: "input from controller",
    started: startedDate.toISOString(),
    ended: endDate.toISOString(),
    userId: req.user._id.toString(),
  });

  try {
    const summary = await reportService.getMonthlyReport(
      req.user._id,
      startedDate,
      endDate,
    );

    // this usefult for frontend
    // const formattedChartData = Object.fromEntries(
    //   Object.entries(summary.dailyData).map(([dateStrt, value]) => [
    //     format(parseISO(dateStrt), "EE"),
    //     value,
    //   ]),
    // );

    return res.status(200).json({
      message: "Monthly report retrieved successfully",
      targetDate,
      targetyear: year,
      targetMonth: month,
      avgCalories: summary.avgCalories,
      highestDay: summary.highestDay,
      daysTracked: summary.daysTracked,
      macros: summary.macros,
      totalCalories: summary.totalCalories,
      totalProtein: summary.totalProtein,
      totalCarbs: summary.totalCarbs,
      totalFat: summary.totalFat,
      totalEntries: summary.totalEntries,
      chartDate: summary.dailyData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error",
    });
  }
};
