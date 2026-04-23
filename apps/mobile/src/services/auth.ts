import { api } from "./api";
import type {
  UserWithToken,
  LoginInput,
  RegisterInput,
  User,
  UpdateProfileInput,
  AuthResponse,
} from "@/types";
import { removeAuthToken, saveAuthToken } from "@/utils/storage";

export const authApi = {
  async register(input: RegisterInput) {
    try {
      console.log("register  input", input);
      const result = await api.post<AuthResponse<UserWithToken>>(
        "auth/register",
        input,
      );
      console.log("result from register", result);

      if (result.user.token) {
        await saveAuthToken(result.user.token);
      }

      return result;
    } catch (error) {
      console.error("error register;", error);
      throw error;
    }
  },
  async login(input: LoginInput) {
    console.log("login input", input);
    try {
      const result = await api.post<AuthResponse<UserWithToken>>(
        "/auth/login",
        input,
      );
      console.log("result from loging", result);

      if (result.user.token) {
        const token = await saveAuthToken(result.user.token);
        console.log("token saved", token);
      }

      return result;
    } catch (error) {
      console.error("error login;", error);
      throw error;
    }
  },
  async getCurrentUser() {
    try {
      const result = await api.get<AuthResponse<UserWithToken>>("/auth/me");
      return result.user;
    } catch (error) {
      console.error("error getCurrentUser;", error);
      throw error;
    }
  },

  async updateProfile(input: UpdateProfileInput) {
    try {
      console.log("updateProfile input", input);
      return await api.put<void>("/auth/update", input);
    } catch (error) {
      console.error("error updateProfile;", error);
      throw error;
    }
  },
  async logout() {
    try {
      return await removeAuthToken();
    } catch (error) {
      console.error("error logout;", error);
      throw error;
    }
  },
};
