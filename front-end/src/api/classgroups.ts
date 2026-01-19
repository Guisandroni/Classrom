import { apiClient } from "./client";
import type { ClassGroup, ClassGroupCreate, ClassGroupUpdate } from "@/types";

export const classGroupsApi = {
  // Listar todas as aulas
  // Endpoint: GET /api/classes
  getAll: async (): Promise<ClassGroup[]> => {
    const response = await apiClient.get<ClassGroup[]>("/classes");
    return response.data;
  },

  // Buscar aula por ID
  // Endpoint: GET /api/classes/{id}
  getById: async (id: number): Promise<ClassGroup> => {
    const response = await apiClient.get<ClassGroup>(`/classes/${id}`);
    return response.data;
  },

  // Buscar aulas por treinamento
  // Endpoint: GET /api/classes/training/{trainingId}
  getByTraining: async (trainingId: number): Promise<ClassGroup[]> => {
    const response = await apiClient.get<ClassGroup[]>(
      `/classes/training/${trainingId}`
    );
    return response.data;
  },

  // Criar nova aula
  // Endpoint: POST /api/classes
  create: async (data: ClassGroupCreate): Promise<ClassGroup> => {
    const response = await apiClient.post<ClassGroup>("/classes", data);
    return response.data;
  },

  // Atualizar aula
  // Endpoint: PUT /api/classes/{id}
  update: async (id: number, data: ClassGroupUpdate): Promise<ClassGroup> => {
    const response = await apiClient.put<ClassGroup>(`/classes/${id}`, data);
    return response.data;
  },

  // Deletar aula
  // Endpoint: DELETE /api/classes/{id}
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/classes/${id}`);
  },
};
