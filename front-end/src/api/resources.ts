import { apiClient } from "./client";
import type { Resource, ResourceCreate, ResourceUpdate } from "@/types";

export const resourcesApi = {
  // Listar todos os recursos
  // Endpoint: GET /api/resources
  getAll: async (): Promise<Resource[]> => {
    const response = await apiClient.get<Resource[]>("/resources");
    return response.data;
  },

  // Buscar recurso por ID
  // Endpoint: GET /api/resources/{id}
  getById: async (id: number): Promise<Resource> => {
    const response = await apiClient.get<Resource>(`/resources/${id}`);
    return response.data;
  },

  // Buscar recursos por aula
  // Endpoint: GET /api/resources/class/{classId}
  getByClass: async (classId: number): Promise<Resource[]> => {
    const response = await apiClient.get<Resource[]>(
      `/resources/class/${classId}`
    );
    return response.data;
  },

  // Criar novo recurso
  // Endpoint: POST /api/resources
  create: async (data: ResourceCreate): Promise<Resource> => {
    const response = await apiClient.post<Resource>("/resources", data);
    return response.data;
  },

  // Atualizar recurso
  // Endpoint: PUT /api/resources/{id}
  update: async (id: number, data: ResourceUpdate): Promise<Resource> => {
    const response = await apiClient.put<Resource>(`/resources/${id}`, data);
    return response.data;
  },

  // Deletar recurso
  // Endpoint: DELETE /api/resources/{id}
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/resources/${id}`);
  },
};
