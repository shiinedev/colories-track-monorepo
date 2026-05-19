export interface Timestamp {
  createdAt: string;
  updatedAt: string;
}

export interface User extends Timestamp {
  id: string;
  username: string;
  email: string;
  dailyColorieTarget: number;
  onBoardingCompleted: boolean;
}

export interface ReponseBase {
  message: string;
}

export type RegisterInput = Pick<
  User,
  "email" | "username" | "dailyColorieTarget"
> & {
  password: string;
};
export type LoginInput = Pick<User, "email"> & { password: string };

export type UserWithToken = User & { token: string };

export type UpdateProfileInput = Partial<
  Pick<User, "username" | "onBoardingCompleted" | "dailyColorieTarget">
>;

export interface AuthResponse<T> extends ReponseBase {
  user: T;
}

export interface FoodResponse<T> extends ReponseBase {
  food: T;
}

export interface ReportResponse<T> extends ReponseBase {
  data: T;
}

export type Feature = {
  iconColor: "IconAmber" | "IconBlue" | "IconViolet";
  title: string;
  text: string;
};

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface IFoodResult {
  userId: string;
  foodname: string;
  description: string;
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
  mealType: MealType;
  imageURl: string;
  storageKey: string;
  timestamp: string;
}

export interface ScanFoodResult extends Omit<IFoodResult, "userId"> {
  imageBase64: string;
  description: string;
}

export type SaveFoodEntryInput = ScanFoodResult;

export type FoodEntry = Omit<ScanFoodResult, "description" | "imageBase64"> & {
  id: string;
};

// report types
// export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

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

export interface IMacrosStats {
  grams: number;
  calories: number;
  percentage: number;
}

export type MicrostatsKeys = "protein" | "carbs" | "fat";

export type MacrosStats = Record<MicrostatsKeys, IMacrosStats>;

export type IDailyStats = IMealStats;

export type DailyData = Record<string, IMealBreakdown>;

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

export interface DailyReportStats {
  goal: number;
  consumed: number;
  remaining: number;
  completedCalories: number;
  totalEntries: number;
  mealBreakdown: Record<MealType, IMealBreakdown>;
  macros: MacrosStats;
}

export interface WeeklyReportStats {
  week: IWeekSummary[];
  macros: MacrosStats;
  totalCalories: number;
  totalCarbs: number;
  totalEntries: number;
  totalFat: number;
  totalProtein: number;
  avgCalories: number;
}

export interface MonthlyReportStats {
  targetDate: Date;
  targetyear: number;
  targetMonth: number;
  avgCalories: number;
  highestDay: number;
  daysTracked: number;
  macros: MacrosStats;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalEntries: number;
  chartDate: DailyData;
}
