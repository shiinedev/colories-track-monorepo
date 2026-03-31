import { reportService } from "@/services/report.service";
import { log } from "evlog";
import type { Request, Response } from "express";

export const getDailyReport = async (req: Request, res: Response) => {
  const { date } = req.query;

  const today = date ? new Date(date as string) : new Date();

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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
      marcos: summary.marcos,
    });
  } catch (error) {
    log.error({
      message: "Failed to get daily report",
      error,
    });
    res.status(500).json({ message: "Internal server error" });
  }
};
