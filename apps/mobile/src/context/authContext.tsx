import {
  UserWithToken,
  RegisterInput,
  UpdateProfileInput,
  LoginInput,
  AuthResponse,
} from "@/types";
import {
  useMutation,
  useQueryClient,
  useQuery,
  type UseMutationResult,
} from "@tanstack/react-query";
import { getAuthToken, saveAuthToken, removeAuthToken } from "@/utils/storage";
import { createContext, use, useContext, useEffect, useState } from "react";
import { authApi } from "@/services/auth";
import { isReadable } from "node:stream";

export interface AuthContextType {
  user: UserWithToken | undefined;
  isAuthenticated: boolean;
  register: UseMutationResult<
    AuthResponse<UserWithToken>,
    Error,
    RegisterInput,
    unknown
  >;
  login: UseMutationResult<
    AuthResponse<UserWithToken>,
    Error,
    LoginInput,
    unknown
  >;
  logout: () => void;
  updateProfile: UseMutationResult<void, Error, UpdateProfileInput, unknown>;
  refetchUser: () => void;
  isLoading: boolean;
  isReady: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    checkToken();
  }, []);

  // checkToken
  const checkToken = async () => {
    try {
      const token = await getAuthToken();
      setHasToken(!!token);
      setIsReady(true);
    } catch (error) {
      setIsReady(true);
      setHasToken(false);
      console.error(error);
    }
  };

  // current User
  const {
    data: user,
    isLoading,
    refetch: refetchUser,
    error: userError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authApi.getCurrentUser(),
    enabled: hasToken && isReady,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    throwOnError: true,
  });

  useEffect(() => {
    if (userError) {
      console.error("Authentication error:", userError);
      logout();
      removeAuthToken();
    }
  }, [userError]);

  // register Muation
  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      if (data.user.token) {
        console.log("token saved", data.user.token);
        await saveAuthToken(data.user.token);
      }
      queryClient.setQueryData(["currentUser"], data);
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  // login Mutation
  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.user.token) {
        saveAuthToken(data.user.token);
      }
      queryClient.setQueryData(["currentUser"], data);
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  // logout
  const logout = () => {
    authApi.logout();
    queryClient.setQueryData(["currentUser"], null);
    removeAuthToken();
  };

  // updateProfile
  const updateProfile = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
    },
  });

  const value = {
    register,
    login,
    logout,
    updateProfile,
    user,
    isLoading,
    refetchUser,
    isAuthenticated: !!user,
    isReady,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
