import { apiClient } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest,
  LogoutResponse,
  UserMe,
} from "@/types";

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login/", data);
    const { access, refresh, user } = response.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("current_user", JSON.stringify(user));

    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      "/auth/register/",
      data,
    );
    const { tokens, user } = response.data;

    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
    localStorage.setItem("current_user", JSON.stringify(user));

    return response.data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem("refresh_token");

    try {
      if (refreshToken) {
        await apiClient.post<LogoutResponse>("/auth/logout/", {
          refresh: refreshToken,
        });
      }
    } catch (error) {
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("current_user");
    }
  },

  refreshToken: async (
    data: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>(
      "/auth/token/refresh/",
      data,
    );
    const { access } = response.data;
    localStorage.setItem("access_token", access);
    return response.data;
  },

  me: async (): Promise<UserMe> => {
    const response = await apiClient.get<UserMe>("/auth/me/");
    return response.data;
  },

  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access_token");
  },

  getCurrentUser: () => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("current_user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAdmin: (): boolean => {
    if (typeof window === "undefined") return false;
    const user = authApi.getCurrentUser();
    return user?.role === "admin";
  },

  isStudent: (): boolean => {
    if (typeof window === "undefined") return false;
    const user = authApi.getCurrentUser();
    return user?.role === "student";
  },
};
