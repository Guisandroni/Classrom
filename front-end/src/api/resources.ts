import { apiClient } from "./client";
import type { Resource, ResourceCreate, ResourceUpdate } from "@/types";

export const resourcesApi = {
  getAll: async (): Promise<Resource[]> => {
    const response = await apiClient.get<Resource[]>("/resources/");
    return response.data;
  },

  getMy: async (): Promise<Resource[]> => {
    const response = await apiClient.get<Resource[]>("/resources/my/");
    return response.data;
  },

  getById: async (id: number): Promise<Resource> => {
    const response = await apiClient.get<Resource>(`/resources/${id}/`);
    return response.data;
  },

  getByType: async (type: string): Promise<Resource[]> => {
    const response = await apiClient.get<Resource[]>(
      `/resources/?resource_type=${type}`,
    );
    return response.data;
  },

  create: async (data: ResourceCreate): Promise<Resource> => {
    const response = await apiClient.post<Resource>("/resources/", data);
    return response.data;
  },

  update: async (id: number, data: ResourceUpdate): Promise<Resource> => {
    const response = await apiClient.put<Resource>(`/resources/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/resources/${id}/`);
  },
};
