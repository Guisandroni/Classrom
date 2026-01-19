import { apiClient } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutResponse,
  StudentMe,
  User,
} from "@/types";

// Chaves usadas no localStorage
const TOKEN_KEY = "access_token";
const USER_KEY = "current_user";

// Helper para converter AuthResponse em User
const authResponseToUser = (response: LoginResponse | RegisterResponse): User => ({
  id: response.id,
  name: response.name,
  email: response.email,
  phoneNumber: response.phoneNumber,
  role: response.role,
});

export const authApi = {
  // ============================================
  // LOGIN
  // ============================================

  // Login de estudante
  // Endpoint: POST /api/auth/student/login
  loginStudent: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/auth/student/login",
      data
    );
    const authResponse = response.data;

    // Salva token e dados do usuário no localStorage
    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authResponseToUser(authResponse)));

    return authResponse;
  },

  // Login de administrador
  // Endpoint: POST /api/auth/admin/login
  loginAdmin: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/auth/admin/login",
      data
    );
    const authResponse = response.data;

    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authResponseToUser(authResponse)));

    return authResponse;
  },

  // ============================================
  // REGISTRO
  // ============================================

  // Registro de estudante
  // Endpoint: POST /api/auth/student/register
  registerStudent: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      "/auth/student/register",
      data
    );
    const authResponse = response.data;

    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authResponseToUser(authResponse)));

    return authResponse;
  },

  // Registro de administrador
  // Endpoint: POST /api/auth/admin/register
  registerAdmin: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      "/auth/admin/register",
      data
    );
    const authResponse = response.data;

    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authResponseToUser(authResponse)));

    return authResponse;
  },

  // ============================================
  // LOGOUT
  // ============================================

  // Logout do usuário
  // Endpoint: POST /api/auth/logout
  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        await apiClient.post<LogoutResponse>("/auth/logout");
      }
    } catch (error) {
      // Ignora erros de logout - limpa tokens de qualquer forma
    } finally {
      authApi.clearTokens();
    }
  },

  // ============================================
  // REFRESH TOKEN
  // ============================================

  // Renovar access token
  // Endpoint: POST /api/auth/token/refresh
  refreshToken: async (
    data: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>(
      "/auth/token/refresh",
      data
    );
    const { accessToken } = response.data;
    localStorage.setItem(TOKEN_KEY, accessToken);
    return response.data;
  },

  // ============================================
  // DADOS DO USUÁRIO
  // ============================================

  // Buscar dados do estudante autenticado
  // Endpoint: GET /api/students/me
  getStudentMe: async (): Promise<StudentMe> => {
    const response = await apiClient.get<StudentMe>("/students/me");
    return response.data;
  },

  // ============================================
  // UTILITÁRIOS DE TOKEN
  // ============================================

  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // ============================================
  // VERIFICAÇÕES DE AUTENTICAÇÃO
  // ============================================

  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  setCurrentUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // ============================================
  // VERIFICAÇÕES DE ROLE
  // ============================================

  isAdmin: (): boolean => {
    if (typeof window === "undefined") return false;
    const user = authApi.getCurrentUser();
    return user?.role === "ADMIN";
  },

  isStudent: (): boolean => {
    if (typeof window === "undefined") return false;
    const user = authApi.getCurrentUser();
    return user?.role === "STUDENT";
  },

  getRole: (): "ADMIN" | "STUDENT" | null => {
    if (typeof window === "undefined") return null;
    const user = authApi.getCurrentUser();
    return user?.role || null;
  },
};
