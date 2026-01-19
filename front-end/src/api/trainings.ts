import { apiClient } from "./client";
import type { Training, TrainingCreate, TrainingUpdate } from "@/types";

export const trainingsApi = {
  // Listar todos os treinamentos
  // Endpoint: GET /api/trainings
  getAll: async (): Promise<Training[]> => {
    const response = await apiClient.get<Training[]>("/trainings");
    return response.data;
  },

  // Buscar treinamento por ID
  // Endpoint: GET /api/trainings/{id}
  getById: async (id: number): Promise<Training> => {
    const response = await apiClient.get<Training>(`/trainings/${id}`);
    return response.data;
  },

  // Buscar treinamentos do usuário autenticado
  // Endpoint: GET /api/trainings/my
  getMy: async (): Promise<Training[]> => {
    const response = await apiClient.get<Training[]>("/trainings/my");
    return response.data;
  },

  // Criar novo treinamento (apenas ADMIN)
  // Endpoint: POST /api/trainings
  create: async (data: TrainingCreate): Promise<Training> => {
    const response = await apiClient.post<Training>("/trainings", data);
    return response.data;
  },

  // Atualizar treinamento (apenas ADMIN)
  // Endpoint: PUT /api/trainings/{id}
  update: async (id: number, data: TrainingUpdate): Promise<Training> => {
    const response = await apiClient.put<Training>(`/trainings/${id}`, data);
    return response.data;
  },

  // Deletar treinamento (apenas ADMIN)
  // Endpoint: DELETE /api/trainings/{id}
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/trainings/${id}`);
  },
};
