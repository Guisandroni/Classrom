import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

// URL base da API Spring Boot
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Criação do cliente Axios com configuração base
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de REQUEST - adiciona token de autenticação
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Verifica se está no navegador
    if (typeof window === "undefined") {
      return config;
    }

    // Busca o token de acesso do localStorage
    const token = localStorage.getItem("access_token");

    // Se existe token, adiciona no header Authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor de RESPONSE - trata erros e renova token
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se erro 401 (não autorizado) e ainda não tentou renovar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window === "undefined") {
        return Promise.reject(error);
      }

      // Tenta renovar o token usando refresh token
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/token/refresh`,
            {
              refreshToken: refreshToken,
            },
          );

          // Salva novo access token
          const { accessToken } = response.data;
          localStorage.setItem("access_token", accessToken);

          // Refaz a requisição original com novo token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Falha ao renovar - limpa tokens e redireciona para login
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("current_user");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  },
);
