// import { api } from "./api";
import { API_URL } from "@/constants/config";
import type {
  UserWithToken,
  LoginInput,
  RegisterInput,
  User,
  UpdateProfileInput,
} from "@/types";
import { removeAuthToken } from "@/utils/storage";
import axios from "axios";

export const authApi = {
  async register(input: RegisterInput) {
    try {
      const result = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      return result.json();
    } catch (error) {
      console.error("error register;", error);
      throw error;
    }
  },
  async login(input: LoginInput) {
    console.log("before fetch login ", input);
    const result = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    console.log("result from login before json", result);

    const text = await result.text();
    console.log("text from login", text);

    let data: unknown;
    try {
      data = JSON.parse(text);
      console.log("json data from login", data);
    } catch {
      throw new Error(`Server returned non-JSON: ${text}`);
    }

    if (!result.ok) {
      throw new Error((data as any)?.message ?? `HTTP ${result.status}`);
    }

    return data;
  },
  // async login(input: LoginInput) {
  //   try {
  //     const result = await fetch(`${API_URL}/auth/login`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(input),
  //     });

  //     console.log("result from loging before json", result);
  //     return result;
  //   } catch (error) {
  //     console.error("error login;", error);
  //     throw error;
  //   }
  // },
  // async getCurrentUser() {
  //   try {
  //     return await api.get<UserWithToken>("/auth/user");
  //   } catch (error) {
  //     console.error("error getCurrentUser;", error);
  //     throw error;
  //   }
  // },

  // async updateProfile(input: UpdateProfileInput) {
  //   try {
  //     return await api.put<User>("/auth/user", input);
  //   } catch (error) {
  //     console.error("error updateProfile;", error);
  //     throw error;
  //   }
  // },
  // async logout() {
  //   try {
  //     return await removeAuthToken();
  //   } catch (error) {
  //     console.error("error logout;", error);
  //     throw error;
  //   }
  // },
};
