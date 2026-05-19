import { AxiosError } from "axios";
import { api } from "./api";
import {
  FoodEntry,
  IFoodResult,
  SaveFoodEntryInput,
  ScanFoodResult,
} from "@/types";
import { API_URL } from "@/constants/config";
import { getAuthToken } from "@/utils/storage";

export const foodService = {
  scanFood: async (formData: FormData): Promise<ScanFoodResult> => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("No token provided");
      const headers: HeadersInit = {};
      headers.Authorization = `Bearer ${token}`;
      const data = await fetch(`${API_URL}/food/scan`, {
        method: "POST",
        body: formData,
        headers,
      });
      const res = await data.json();

      return res?.food as ScanFoodResult;
    } catch (error) {
      console.error("Error scanning food", error);
      throw error;
    }
  },
  analyzeImage: async (formData: FormData): Promise<IFoodResult> => {
    try {
      const data = await api.post<IFoodResult>("/food/analyze", formData);

      return data;
    } catch (error) {
      console.error("Error analyzing image", error);
      throw (
        (error as AxiosError<{ message: string }>)?.response?.data?.message ??
        "Error analyzing image"
      );
    }
  },
  saveFood: async (foodData: SaveFoodEntryInput): Promise<IFoodResult> => {
    try {
      const data = await api.post<IFoodResult>("/food/save", foodData);
      return data;
    } catch (error) {
      console.error("Error saving food", error);
      throw (
        (error as AxiosError<{ message: string }>)?.response?.data?.message ??
        "Error saving food"
      );
    }
  },

  discardFood: async (storageKey: string): Promise<IFoodResult> => {
    try {
      const data = await api.post<IFoodResult>("/food/discard", { storageKey });
      return data;
    } catch (error) {
      console.error("Error discarding food", error);
      throw (
        (error as AxiosError<{ message: string }>)?.response?.data?.message ??
        "Error discarding food"
      );
    }
  },

  getFoodEntries: async (date: string): Promise<FoodEntry[]> => {
    try {
      const data = await api.get<{ entries: FoodEntry[] }>("/food", {
        params: { date },
      });
      return data.entries;
    } catch (error) {
      console.error("Error getting food entries", error);
      throw (
        (error as AxiosError<{ message: string }>)?.response?.data?.message ??
        "Error getting food entries"
      );
    }
  },
};
