import { apiClient } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutResponse,
  UserMe,
} from "@/types";

const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "current_user";

export const authApi = {
  // User login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/user/login", data);
    const { access, refresh, user } = response.data;

    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return response.data;
  },

  // Admin login
  loginAdmin: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/admin/login", data);
    const { access, refresh, user } = response.data;

    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return response.data;
  },

  // User registration
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const endpoint = data.role === "admin" ? "/auth/admin/register" : "/auth/user/register";
    const response = await apiClient.post<RegisterResponse>(endpoint, data);
    const { tokens, user } = response.data;

    localStorage.setItem(TOKEN_KEY, tokens.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    try {
      if (refreshToken) {
        await apiClient.post<LogoutResponse>("/auth/logout", {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      // Ignore logout errors - we'll clear tokens anyway
    } finally {
      authApi.clearTokens();
    }
  },

  // Refresh access token
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>(
      "/auth/token/refresh",
      data,
    );
    const { access } = response.data;
    localStorage.setItem(TOKEN_KEY, access);
    return response.data;
  },

  // Get current user info
  me: async (): Promise<UserMe> => {
    const response = await apiClient.get<UserMe>("/auth/me");
    return response.data;
  },

  // Token management utilities
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens: (access: string, refresh: string): void => {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },

  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  // Get stored user data
  getCurrentUser: () => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Update stored user data
  setCurrentUser: (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Check user role
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

  // Get user role
  getRole: (): "admin" | "student" | null => {
    if (typeof window === "undefined") return null;
    const user = authApi.getCurrentUser();
    return user?.role || null;
  },
};
