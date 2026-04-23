import { Feature } from "@/types";

export const API_URL =
  "https://calories-track-api-production.up.railway.app/api/v1";
export const AUTH_TOKEN_KEY = "token";

export const FEATURES: Feature[] = [
  {
    iconColor: "IconAmber",
    title: "Capture Your Meals",
    text: "Take photos of your food",
  },
  {
    iconColor: "IconBlue",
    title: "Auto Calorie Tracking",
    text: "AI-powered nutrition analysis",
  },
  {
    iconColor: "IconViolet",
    title: "Detailed Reports",
    text: "Track your progress over time",
  },
];
